"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";
  const message = searchParams.get("message") ?? "";

  return (
    <>
      <AppHeader />
      <main className="min-h-[calc(100vh-64px)] bg-white px-6 py-14">
        <div className="mx-auto w-full max-w-lg">
          <h1 className="text-xl font-semibold text-[#111]">결제가 완료되지 않았습니다</h1>
          <p className="mt-4 text-sm text-[#6b7280]">
            결제를 취소했거나 일시적인 오류가 발생했을 수 있습니다. 다시 시도하거나 마이페이지에서 상태를 확인해 주세요.
          </p>
          {(code || message) && (
            <p className="mt-4 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-left text-xs text-[#4b5563]">
              {code ? <span className="block">코드: {code}</span> : null}
              {message ? (
                <span className="mt-1 block">
                  메시지:{" "}
                  {(() => {
                    try {
                      return decodeURIComponent(message);
                    } catch {
                      return message;
                    }
                  })()}
                </span>
              ) : null}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/mypage"
              className="inline-flex h-10 items-center rounded-lg border border-[#e5e7eb] bg-white px-4 text-sm font-medium text-[#111] hover:bg-[#f9fafb]"
            >
              마이페이지
            </Link>
            <Link
              href="/payment"
              className="inline-flex h-10 items-center rounded-lg bg-[#111] px-4 text-sm font-semibold text-white hover:bg-black"
            >
              결제 페이지로
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <>
          <AppHeader />
          <main className="min-h-[calc(100vh-64px)] bg-white px-6 py-14">
            <p className="text-sm text-[#6b7280]">불러오는 중…</p>
          </main>
        </>
      }
    >
      <PaymentFailContent />
    </Suspense>
  );
}
