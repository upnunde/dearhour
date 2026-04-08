import Link from "next/link";
import AppHeader from "@/components/AppHeader";

const providers = ["카카오", "구글", "애플"];

export default function LoginPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-[calc(100vh-64px)] bg-[#f9fafb] px-6 py-16">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-[#111]">간편 로그인</h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            회원가입 없이 로그인만으로 바로 초대장을 만들 수 있습니다.
          </p>

          <div className="mt-6 space-y-2">
            {providers.map((provider) => (
              <button
                key={provider}
                type="button"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-[#e5e7eb] text-sm font-medium text-[#111] hover:bg-[#f9fafb]"
              >
                {provider}로 계속하기
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-[#6b7280] hover:text-[#111]">
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
