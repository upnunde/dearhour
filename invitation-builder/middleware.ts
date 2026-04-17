import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_PREFIXES = ["/mypage", "/admin", "/payment"];
// /admin/login 은 마스터 로그인 자체이므로 인증 체크에서 제외한다.
const PUBLIC_EXCEPTIONS = ["/admin/login"];

export async function middleware(request: NextRequest) {
  try {
    const { response, user } = await updateSession(request);
    const { pathname, search } = request.nextUrl;

    const isPublicException = PUBLIC_EXCEPTIONS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
    const needsAuth = !isPublicException && PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    if (!needsAuth || user) {
      return response;
    }

    const loginUrl = request.nextUrl.clone();
    // 관리자 경로(/admin/*) 진입 실패 시에는 /admin/login 으로 돌려보낸다.
    loginUrl.pathname = pathname.startsWith("/admin") ? "/admin/login" : "/login";
    loginUrl.search = `?next=${encodeURIComponent(`${pathname}${search}`)}`;
    return NextResponse.redirect(loginUrl);
  } catch {
    // Supabase 환경변수가 없는 초기 개발 환경에서는 기존 라우팅을 막지 않는다.
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
