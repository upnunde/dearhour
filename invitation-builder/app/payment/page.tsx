import Link from "next/link";
import AppHeader from "@/components/AppHeader";

const plans = [
  { name: "기본", price: "무료", desc: "초대장 생성 및 공유" },
  { name: "프리미엄", price: "9,900원", desc: "도메인/통계/추가 커스텀 기능" },
];

export default function PaymentPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-[calc(100vh-64px)] bg-white px-6 py-14">
        <div className="mx-auto w-full max-w-4xl">
          <h1 className="text-2xl font-semibold text-[#111]">결제</h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            추후 PG 연동을 고려한 기본 결제 페이지 구조입니다.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {plans.map((plan) => (
              <section key={plan.name} className="rounded-xl border border-[#e5e7eb] p-5">
                <h2 className="text-lg font-semibold text-[#111]">{plan.name}</h2>
                <p className="mt-1 text-2xl font-bold text-[#111]">{plan.price}</p>
                <p className="mt-2 text-sm text-[#6b7280]">{plan.desc}</p>
                <button
                  type="button"
                  className="mt-4 inline-flex h-10 items-center rounded-lg border border-[#e5e7eb] px-4 text-sm font-medium text-[#111] hover:bg-[#f9fafb]"
                >
                  {plan.name} 선택
                </button>
              </section>
            ))}
          </div>

          <div className="mt-8">
            <Link href="/mypage" className="text-sm text-[#6b7280] hover:text-[#111]">
              마이페이지로 이동
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
