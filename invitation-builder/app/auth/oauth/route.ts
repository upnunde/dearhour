import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ALLOWED_PROVIDERS = new Set(["google", "kakao"]);

function getBaseUrl(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  return request.nextUrl.origin;
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

  const callbackUrl = `${getBaseUrl(request)}/auth/callback?next=${encodeURIComponent(next)}`;
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
