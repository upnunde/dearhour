import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSeoulYmd } from "@/lib/invitation-view-stats";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ invitationId: string }> | { invitationId: string } },
) {
  const { invitationId } = await context.params;
  const id = String(invitationId ?? "").trim();
  if (!id) {
    return NextResponse.json({ error: "청첩장 ID가 필요합니다." }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const burst = checkRateLimit(`inv-view-burst:${ip}`, 120, 60_000);
  if (!burst.ok) {
    return NextResponse.json({ error: "요청이 너무 많습니다." }, { status: 429 });
  }

  const exists = await prisma.invitation.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!exists) {
    return NextResponse.json({ error: "청첩장을 찾을 수 없습니다." }, { status: 404 });
  }

  const statDate = getSeoulYmd();
  const now = new Date();

  try {
    await prisma.$transaction([
      prisma.invitation.update({
        where: { id },
        data: {
          publicViewCount: { increment: 1 },
          lastPublicViewAt: now,
        },
      }),
      prisma.invitationDailyView.upsert({
        where: {
          invitationId_statDate: { invitationId: id, statDate },
        },
        create: { invitationId: id, statDate, views: 1 },
        update: { views: { increment: 1 } },
      }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "집계 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
