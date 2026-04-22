import Link from "next/link";
import AppHeader from "@/components/AppHeader";

type Provider = {
  id: "google" | "kakao";
  label: string;
  buttonClass: string;
  icon: React.ReactNode;
};

const providers: Provider[] = [
  {
    id: "kakao",
    label: "카카오로 계속하기",
    buttonClass: "bg-[#FEE500] text-[#191919] hover:bg-[#FDD835]",
    icon: (
      // 카카오 말풍선
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 3C6.48 3 2 6.58 2 11c0 2.8 1.83 5.26 4.6 6.67l-1.13 4.13c-.09.32.26.57.54.4L11 19.23c.33.03.66.05 1 .05 5.52 0 10-3.58 10-8S17.52 3 12 3z"
        />
      </svg>
    ),
  },
  {
    id: "google",
    label: "구글로 계속하기",
    buttonClass:
      "bg-white text-[#1f1f1f] border border-[#dadce0] hover:bg-[#f8f9fa]",
    icon: (
      // 구글 공식 G 로고 (4색)
      <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        />
        <path
          fill="#FBBC05"
          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        />
      </svg>
    ),
  },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string; error?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const next = params.next || "/mypage";

  const errorMessage = (() => {
    switch (params.error) {
      case "provider":
        return "지원하지 않는 로그인 방식입니다.";
      case "missing_env":
        return "배포 서버에 Supabase 공개 환경변수가 없습니다. 호스팅(Vercel 등)에 NEXT_PUBLIC_SUPABASE_URL 과 NEXT_PUBLIC_SUPABASE_ANON_KEY 를 설정한 뒤 재배포해 주세요.";
      case "oauth":
        return "소셜 로그인 요청 중 문제가 발생했습니다. 다시 시도해 주세요.";
      case "callback":
      case "missing_code":
        return "로그인 콜백 처리에 실패했습니다. 다시 시도해 주세요.";
      case undefined:
        return null;
      default:
        return `로그인 처리 중 오류가 발생했습니다. (${params.error})`;
    }
  })();

  return (
    <>
      <AppHeader />
      <main className="min-h-[calc(100vh-64px)] bg-[#f9fafb] px-6 py-16">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-[#111]">
            간편 로그인
          </h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            회원가입 없이 소셜 계정으로 바로 시작할 수 있어요.
          </p>

          <div className="mt-6 flex flex-col gap-2">
            {providers.map((provider) => (
              <Link
                key={provider.id}
                href={`/auth/oauth?provider=${provider.id}&next=${encodeURIComponent(next)}`}
                className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors ${provider.buttonClass}`}
              >
                <span className="inline-flex items-center justify-center">
                  {provider.icon}
                </span>
                <span>{provider.label}</span>
              </Link>
            ))}
          </div>

          {errorMessage ? (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <p className="mt-6 text-center text-sm leading-relaxed text-[#9ca3af]">
            로그인 시 서비스 이용약관과 개인정보 처리방침에 동의한 것으로
            간주됩니다.
          </p>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-[#6b7280] hover:text-[#111]"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
