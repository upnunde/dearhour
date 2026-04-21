import type { Metadata } from "next";
import AdminLoginForm from "./admin-login-form";

// 검색엔진 노출 방지 — 본인만 아는 URL로 운영.
export const metadata: Metadata = {
  title: "마스터 로그인",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#f9fafb] px-6 py-16">
      <div className="mx-auto w-full max-w-sm rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight text-[#111]">마스터 로그인</h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          관리자 전용 페이지입니다. 계정이 없으면 접근할 수 없습니다.
        </p>

        <div className="mt-6">
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
