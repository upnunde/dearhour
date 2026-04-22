"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";

async function readErrorMessage(res: Response) {
  try {
    const j = (await res.json()) as { message?: string };
    return j.message ?? `확인 실패 (${res.status})`;
  } catch {
    return `확인 실패 (${res.status})`;
  }
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("결제를 확인하는 중입니다…");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey") ?? "";
    const orderId = searchParams.get("orderId") ?? "";
    const amount = Number(searchParams.get("amount"));

    if (!paymentKey || !orderId || !Number.isFinite(amount) || amount < 1) {
      setMessage("결제 정보가 올바르지 않습니다. 마이페이지에서 결제 상태를 확인해 주세요.");
      setDone(true);
      return;
    }

    let cancelled = false;

    (async () => {
      const res = await fetch("/api/payments/toss/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentKey, orderId, amount }),
      });

      if (cancelled) return;

      if (!res.ok) {
        setMessage(await readErrorMessage(res));
        setDone(true);
        return;
      }

      const j = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!j.ok) {
        setMessage("결제 확인에 실패했습니다.");
        setDone(true);
        return;
      }

      setMessage("결제가 완료되었습니다. 마이페이지로 이동합니다.");
      setDone(true);
      router.replace("/mypage?paid=1");
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, router]);

  return (
    <>
      <AppHeader />
      <main className="min-h-[calc(100vh-64px)] bg-white px-6 py-14">
        <div className="mx-auto w-full max-w-lg text-center">
          <h1 className="text-xl font-semibold text-[#111]">결제 완료 처리</h1>
          <p className="mt-4 text-sm text-[#6b7280]">{message}</p>
          {done ? (
            <p className="mt-6">
              <Link href="/mypage" className="text-sm font-medium text-[#0064FF] hover:underline">
                마이페이지로 이동
              </Link>
            </p>
          ) : null}
        </div>
      </main>
    </>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <>
          <AppHeader />
          <main className="min-h-[calc(100vh-64px)] bg-white px-6 py-14">
            <div className="mx-auto w-full max-w-lg text-center">
              <h1 className="text-xl font-semibold text-[#111]">결제 완료 처리</h1>
              <p className="mt-4 text-sm text-[#6b7280]">불러오는 중…</p>
            </div>
          </main>
        </>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
