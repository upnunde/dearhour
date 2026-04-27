import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

const SIDES = new Set(["신랑측", "신부측"]);
const INTENTS = new Set(["참석", "불참"]);

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = checkRateLimit(`rsvp:${ip}`, 30, 60_000);
  if (!rate.ok) {
    return NextResponse.json({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as {
    invitationId?: string;
    side?: string;
    intent?: string;
    guestName?: string;
    companionCount?: number;
  } | null;

  const invitationId = String(body?.invitationId ?? "").trim();
  const side = String(body?.side ?? "").trim();
  const intent = String(body?.intent ?? "").trim();
  const guestName = String(body?.guestName ?? "").trim();
  const companionRaw = body?.companionCount;

  if (!invitationId) {
    return NextResponse.json({ error: "청첩장 정보가 필요합니다." }, { status: 400 });
  }
  if (!SIDES.has(side)) {
    return NextResponse.json({ error: "구분 값이 올바르지 않습니다." }, { status: 400 });
  }
  if (!INTENTS.has(intent)) {
    return NextResponse.json({ error: "참석 의사 값이 올바르지 않습니다." }, { status: 400 });
  }
  if (!guestName || guestName.length > 80) {
    return NextResponse.json({ error: "성함을 올바르게 입력해 주세요." }, { status: 400 });
  }

  let companionCount = 0;
  if (typeof companionRaw === "number" && Number.isFinite(companionRaw)) {
    companionCount = Math.max(0, Math.min(50, Math.floor(companionRaw)));
  } else if (companionRaw != null) {
    const parsed = Number.parseInt(String(companionRaw), 10);
    if (Number.isFinite(parsed)) companionCount = Math.max(0, Math.min(50, parsed));
  }

  if (intent === "불참") {
    companionCount = 0;
  }

  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    select: { id: true },
  });
  if (!invitation) {
    return NextResponse.json({ error: "청첩장을 찾을 수 없습니다." }, { status: 404 });
  }

  try {
    const created = await prisma.rsvpSubmission.create({
      data: {
        invitationId,
        side,
        intent,
        guestName,
        companionCount,
      },
      select: { id: true, createdAt: true },
    });
    return NextResponse.json({ ok: true, id: created.id, createdAt: created.createdAt.toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "저장 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
