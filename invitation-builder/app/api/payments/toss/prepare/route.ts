import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { syncUserProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { computeWatermarkAmount } from "@/lib/payments/watermark-pricing";
import { getTossClientKey } from "@/lib/payments/toss-env";

export async function POST(request: NextRequest) {
  const clientKey = getTossClientKey();
  if (!clientKey) {
    return NextResponse.json(
      { message: "결제 연동 키가 설정되지 않았습니다. NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY 를 확인해 주세요." },
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
  const rate = checkRateLimit(`toss-prepare:${synced.id}`, 15, 60_000);
  if (!rate.ok) {
    return NextResponse.json({ message: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as
    | { invitationId?: string; durationId?: string; promoCode?: string | null }
    | null;

  const invitationId = String(body?.invitationId ?? "").trim();
  if (!invitationId) {
    return NextResponse.json({ message: "초대장 정보가 없습니다." }, { status: 400 });
  }

  const invitation = await prisma.invitation.findFirst({
    where: { id: invitationId, userId: synced.id },
  });
  if (!invitation) {
    return NextResponse.json({ message: "초대장을 찾을 수 없습니다." }, { status: 404 });
  }

  const promoRaw = body?.promoCode;
  const promoNormalized =
    typeof promoRaw === "string" && promoRaw.trim() ? promoRaw.trim().toUpperCase() : null;

  const { amount, months, durationId } = computeWatermarkAmount(
    String(body?.durationId ?? "3m"),
    promoNormalized,
  );

  if (amount <= 0) {
    return NextResponse.json({ message: "결제 금액이 올바르지 않습니다." }, { status: 400 });
  }

  const orderId = `wm_${randomUUID().replace(/-/g, "")}`;
  const metadata: Prisma.InputJsonValue = {
    intent: "remove-watermark",
    durationId,
    durationMonths: months,
    promoCode: promoNormalized,
  };

  await prisma.payment.create({
    data: {
      userId: synced.id,
      invitationId: invitation.id,
      orderId,
      amount,
      currency: "KRW",
      status: "READY",
      provider: "TOSS",
      metadata,
    },
  });

  const orderName = `워터마크 제거 (${months}개월)`;

  return NextResponse.json({
    clientKey,
    customerKey: `dh_${synced.id}`,
    orderId,
    amount,
    orderName,
    customerEmail: synced.email ?? undefined,
    customerName: synced.name ?? undefined,
  });
}
