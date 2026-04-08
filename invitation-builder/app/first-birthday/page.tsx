import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export default function FirstBirthdayPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-[calc(100vh-64px)] bg-white">
        <section className="w-full bg-[#fff8f3]">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <p className="text-sm font-semibold text-[#6b7280]">서비스 소개</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#111]">돌잔치 초대장</h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#4b5563]">
              아이의 첫 생일을 위한 사진 중심 소개 페이지를 쉽게 만들 수 있습니다. 일정, 장소, 안내 문구를 보기
              좋게 정리해 전달하세요.
            </p>
            <div className="mt-8">
              <Link
                href="/editor"
                className="inline-flex h-11 items-center rounded-lg bg-[#111] px-5 text-sm font-semibold text-white hover:bg-black"
              >
                돌잔치 초대장 만들기
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
