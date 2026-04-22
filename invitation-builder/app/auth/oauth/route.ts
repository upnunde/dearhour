import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ALLOWED_PROVIDERS = new Set(["google", "kakao"]);

/**
 * OAuth redirectTo 는 반드시 사용자가 로그인을 시작한 origin 과 같아야 한다.
 * NEXT_PUBLIC_APP_URL 이 localhost:3000 인데 실제 접속이 :3001 이면 PKCE 쿠키가 전달되지 않아
 * 콜백에서 exchangeCodeForSession 이 실패한다(구글/카카오 공통, 구글에서 더 자주 체감).
 */
function getOAuthAppBaseUrl(request: NextRequest) {
  const currentOrigin = request.nextUrl.origin;
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "").trim();
  if (!configured) return currentOrigin;
  try {
    const configuredOrigin = new URL(configured).origin;
    if (configuredOrigin === currentOrigin) return configured;
  } catch {
    // 잘못된 URL 형식이면 요청 origin 으로 폴백
  }
  return currentOrigin;
}

export async function GET(request: NextRequest) {
  const provider = (request.nextUrl.searchParams.get("provider") ?? "").toLowerCase();
  const rawNext = request.nextUrl.searchParams.get("next") ?? "/mypage";
  const next = rawNext.startsWith("/") ? rawNext : "/mypage";

  if (!ALLOWED_PROVIDERS.has(provider)) {
    return NextResponse.redirect(new URL("/login?error=provider", request.url));
  }

  // PKCE verifier 쿠키 저장을 위해 반드시 SSR 클라이언트 사용.
  // bare createClient를 쓰면 verifier가 저장되지 않아 콜백에서 exchangeCodeForSession이 실패함.
  let supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return NextResponse.redirect(new URL("/login?error=missing_env", request.url));
  }

  const callbackUrl = `${getOAuthAppBaseUrl(request)}/auth/callback?next=${encodeURIComponent(next)}`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as "google" | "kakao",
    options: {
      redirectTo: callbackUrl,
      // 구글은 refresh token을 강제로 받기 위해 prompt=consent + access_type=offline 필요
      queryParams:
        provider === "google"
          ? { access_type: "offline", prompt: "consent" }
          : undefined,
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(new URL("/login?error=oauth", request.url));
  }

  return NextResponse.redirect(data.url);
}
