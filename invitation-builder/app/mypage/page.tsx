import Link from "next/link";
import AppHeader from "@/components/AppHeader";

const cards = [
  { title: "민준 · 서연 결혼식", status: "발행됨", expires: "2027-01-31" },
  { title: "우리 가족 돌잔치", status: "임시저장", expires: "-" },
];

export default function MyPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-[calc(100vh-64px)] bg-[#f9fafb] px-6 py-12">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#111]">마이페이지</h1>
              <p className="mt-1 text-sm text-[#6b7280]">내가 만든 초대장과 발행 상태를 관리합니다.</p>
            </div>
            <Link
              href="/editor"
              className="inline-flex h-10 items-center rounded-lg border border-[#e5e7eb] px-4 text-sm font-medium text-[#111] hover:bg-white"
            >
              새 초대장 만들기
            </Link>
          </div>

          <div className="space-y-3">
            {cards.map((card) => (
              <article
                key={card.title}
                className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm"
              >
                <h2 className="text-base font-semibold text-[#111]">{card.title}</h2>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-[#6b7280]">
                  <span>상태: {card.status}</span>
                  <span>만료일: {card.expires}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
