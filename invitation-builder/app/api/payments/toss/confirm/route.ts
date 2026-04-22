import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { syncUserProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getTossWidgetSecretKey } from "@/lib/payments/toss-env";

type TossConfirmResponse = {
  paymentKey?: string;
  orderId?: string;
  totalAmount?: number;
  status?: string;
  message?: string;
  code?: string;
};

function tossAuthHeader(secretKey: string) {
  const token = Buffer.from(`${secretKey}:`).toString("base64");
  return `Basic ${token}`;
}

export async function POST(request: NextRequest) {
  const secretKey = getTossWidgetSecretKey();
  if (!secretKey) {
    return NextResponse.json(
      { message: "결제 시크릿 키가 설정되지 않았습니다. TOSS_PAYMENTS_WIDGET_SECRET_KEY 를 확인해 주세요." },
      { status: 503 },
    );
  }

  let supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return NextResponse.json({ message: "인증 설정이 아직 완료되지 않았습니다." }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const synced = await syncUserProfile(user);

  const body = (await request.json().catch(() => null)) as
    | { paymentKey?: string; orderId?: string; amount?: number }
    | null;

  const paymentKey = String(body?.paymentKey ?? "").trim();
  const orderId = String(body?.orderId ?? "").trim();
  const amount = Number(body?.amount);

  if (!paymentKey || !orderId || !Number.isFinite(amount) || amount < 1) {
    return NextResponse.json({ message: "결제 정보가 올바르지 않습니다." }, { status: 400 });
  }

  const payment = await prisma.payment.findFirst({
    where: { orderId, userId: synced.id },
    include: { invitation: true },
  });

  if (!payment) {
    return NextResponse.json({ message: "주문을 찾을 수 없습니다." }, { status: 404 });
  }

  if (payment.status === "PAID") {
    return NextResponse.json({ ok: true, alreadyPaid: true });
  }

  if (payment.amount !== amount) {
    return NextResponse.json({ message: "결제 금액이 주문과 일치하지 않습니다." }, { status: 400 });
  }

  const tossRes = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: tossAuthHeader(secretKey),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  const tossJson = (await tossRes.json().catch(() => ({}))) as TossConfirmResponse;

  if (!tossRes.ok) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });
    return NextResponse.json(
      {
        message: tossJson.message ?? "토스 결제 승인에 실패했습니다.",
        code: tossJson.code,
      },
      { status: 400 },
    );
  }

  const confirmedKey = String(tossJson.paymentKey ?? paymentKey);

  const meta = payment.metadata as
    | { durationMonths?: number; intent?: string }
    | null
    | undefined;
  const months = typeof meta?.durationMonths === "number" ? meta.durationMonths : 3;

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        paidAt: new Date(),
        tossPaymentKey: confirmedKey,
      },
    });

    if (payment.invitationId) {
      const expires = new Date();
      expires.setMonth(expires.getMonth() + months);
      await tx.invitation.update({
        where: { id: payment.invitationId },
        data: {
          status: "PUBLISHED",
          expiresAt: expires,
        },
      });
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: synced.id,
      action: "payment.toss.confirmed",
      targetType: "Payment",
      targetId: payment.id,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      userAgent: request.headers.get("user-agent"),
      payload: { orderId, amount } as Prisma.InputJsonValue,
    },
  });

  return NextResponse.json({ ok: true });
}
