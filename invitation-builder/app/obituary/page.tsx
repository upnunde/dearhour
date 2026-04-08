import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export default function ObituaryPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-[calc(100vh-64px)] bg-white">
        <section className="w-full bg-[#f8f8f8]">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <p className="text-sm font-semibold text-[#6b7280]">서비스 소개</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#111]">부고장</h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#4b5563]">
              전달해야 할 핵심 정보만 정중하고 차분한 레이아웃으로 구성할 수 있는 부고장 전용 템플릿 페이지입니다.
            </p>
            <div className="mt-8">
              <Link
                href="/editor"
                className="inline-flex h-11 items-center rounded-lg bg-[#111] px-5 text-sm font-semibold text-white hover:bg-black"
              >
                부고장 작성 시작
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
