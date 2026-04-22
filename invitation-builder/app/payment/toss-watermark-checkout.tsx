"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import type { TossPaymentsWidgets, WidgetAgreementWidget, WidgetPaymentMethodWidget } from "@tosspayments/tosspayments-sdk";

type PrepareJson = {
  clientKey: string;
  customerKey: string;
  orderId: string;
  amount: number;
  orderName: string;
  customerEmail?: string;
  customerName?: string;
};

async function readErrorMessage(res: Response) {
  try {
    const j = (await res.json()) as { message?: string };
    return j.message ?? `요청 실패 (${res.status})`;
  } catch {
    return `요청 실패 (${res.status})`;
  }
}

export default function TossWatermarkCheckout({
  invitationId,
  durationId,
  promoCode,
  finalAmount,
  disabled,
}: {
  invitationId: string;
  durationId: string;
  promoCode: string | null;
  finalAmount: number;
  disabled?: boolean;
}) {
  const [phase, setPhase] = useState<"idle" | "preparing" | "ready" | "opening" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);
  const pmRef = useRef<WidgetPaymentMethodWidget | null>(null);
  const agRef = useRef<WidgetAgreementWidget | null>(null);
  const sessionRef = useRef<PrepareJson | null>(null);

  const tearDown = useCallback(async () => {
    try {
      await pmRef.current?.destroy();
    } catch {
      /* noop */
    }
    try {
      await agRef.current?.destroy();
    } catch {
      /* noop */
    }
    pmRef.current = null;
    agRef.current = null;
    widgetsRef.current = null;
    sessionRef.current = null;
  }, []);

  useEffect(() => {
    void tearDown();
    setPhase("idle");
    setErrorMsg(null);
  }, [invitationId, durationId, promoCode, finalAmount, tearDown]);

  useEffect(() => {
    return () => {
      void tearDown();
    };
  }, [tearDown]);

  const prepareAndRender = async () => {
    setErrorMsg(null);
    if (finalAmount < 1) {
      setErrorMsg("결제 금액이 올바르지 않습니다.");
      setPhase("error");
      return;
    }
    setPhase("preparing");
    await tearDown();

    const res = await fetch("/api/payments/toss/prepare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invitationId,
        durationId,
        promoCode: promoCode ?? undefined,
      }),
    });

    if (!res.ok) {
      setErrorMsg(await readErrorMessage(res));
      setPhase("error");
      return;
    }

    const data = (await res.json()) as PrepareJson;
    if (!data.clientKey || !data.customerKey || !data.orderId) {
      setErrorMsg("결제 준비 응답이 올바르지 않습니다.");
      setPhase("error");
      return;
    }

    if (data.amount !== finalAmount) {
      setErrorMsg("서버에서 확정한 금액과 화면 금액이 다릅니다. 새로고침 후 다시 시도해 주세요.");
      setPhase("error");
      return;
    }

    sessionRef.current = data;

    try {
      const tossPayments = await loadTossPayments(data.clientKey);
      const widgets = tossPayments.widgets({ customerKey: data.customerKey });
      widgetsRef.current = widgets;

      await widgets.setAmount({ currency: "KRW", value: data.amount });

      pmRef.current = await widgets.renderPaymentMethods({
        selector: "#dearhour-toss-payment-method",
        variantKey: "DEFAULT",
      });

      agRef.current = await widgets.renderAgreement({
        selector: "#dearhour-toss-agreement",
      });

      setPhase("ready");
    } catch (e) {
      console.error(e);
      setErrorMsg("결제 UI를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
      setPhase("error");
      await tearDown();
    }
  };

  const openPayment = async () => {
    const widgets = widgetsRef.current;
    const session = sessionRef.current;
    if (!widgets || !session) return;

    setPhase("opening");
    setErrorMsg(null);

    const origin = window.location.origin;

    try {
      await widgets.requestPayment({
        orderId: session.orderId,
        orderName: session.orderName,
        successUrl: `${origin}/payment/success`,
        failUrl: `${origin}/payment/fail`,
        customerEmail: session.customerEmail,
        customerName: session.customerName,
      });
    } catch (e) {
      console.error(e);
      setErrorMsg("결제 요청을 시작하지 못했습니다.");
      setPhase("ready");
    }
  };

  return (
    <div className="mt-5 space-y-4">
      {errorMsg ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">{errorMsg}</p>
      ) : null}

      {phase === "idle" || phase === "error" ? (
        <button
          type="button"
          disabled={disabled || finalAmount < 1}
          onClick={() => void prepareAndRender()}
          className="inline-flex h-11 items-center rounded-lg bg-[#0064FF] px-5 text-sm font-semibold text-white hover:bg-[#0052d4] disabled:cursor-not-allowed disabled:opacity-50"
        >
          토스로 결제 준비하기 ({finalAmount.toLocaleString("ko-KR")}원)
        </button>
      ) : null}

      {phase === "preparing" ? (
        <p className="text-sm text-[#6b7280]">토스 결제 화면을 불러오는 중입니다…</p>
      ) : null}

      {phase === "ready" || phase === "opening" ? (
        <div className="space-y-4">
          <div id="dearhour-toss-payment-method" className="min-h-[120px] w-full" />
          <div id="dearhour-toss-agreement" className="w-full" />
          <button
            type="button"
            disabled={phase === "opening"}
            onClick={() => void openPayment()}
            className="inline-flex h-11 items-center rounded-lg bg-[#111] px-5 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {phase === "opening" ? "결제창 여는 중…" : `${finalAmount.toLocaleString("ko-KR")}원 결제하기`}
          </button>
        </div>
      ) : null}
    </div>
  );
}
