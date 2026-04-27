import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";

function isTempLoginAllowed() {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.ENABLE_DEV_TEMP_LOGIN === "true"
  );
}

/**
 * 로컬 개발: 익명 로그인( Supabase Anonymous 활성화 필요 ) 또는
 * DEV_TEMP_LOGIN_EMAIL / DEV_TEMP_LOGIN_PASSWORD 가 있으면 해당 계정으로 로그인.
 * 프로덕션: ENABLE_DEV_TEMP_LOGIN=true 일 때만 허용(보통 이메일·비밀번호).
 */
export async function GET(request: NextRequest) {
  if (!isTempLoginAllowed()) {
    return NextResponse.redirect(new URL("/login?error=dev_forbidden", request.url));
  }

  const nextRaw = request.nextUrl.searchParams.get("next") ?? "/mypage";
  const nextPath = nextRaw.startsWith("/") ? nextRaw : "/mypage";
  const redirectUrl = new URL(nextPath, request.url);

  let response = NextResponse.redirect(redirectUrl);

  try {
    const { url, anonKey } = getSupabaseEnv();
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const email = (process.env.DEV_TEMP_LOGIN_EMAIL ?? "").trim();
    const password = process.env.DEV_TEMP_LOGIN_PASSWORD ?? "";

    if (email && password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return NextResponse.redirect(new URL("/login?error=dev_login", request.url));
      }
      return response;
    }

    if (process.env.NODE_ENV === "development") {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) {
        return NextResponse.redirect(new URL("/login?error=dev_login", request.url));
      }
      return response;
    }

    return NextResponse.redirect(new URL("/login?error=dev_login_config", request.url));
  } catch {
    return NextResponse.redirect(new URL("/login?error=dev_login_config", request.url));
  }
}
