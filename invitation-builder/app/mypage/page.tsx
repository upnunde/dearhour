import { requireUser, syncUserProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MyPageClient, {
  type GuestMediaItem,
  type MyInvitationItem,
  type MyPaymentItem,
} from "@/app/mypage/mypage-client";
import { readdir, stat } from "fs/promises";
import type { Dirent } from "fs";
import path from "path";
import { getSeoulYmd, seoulYmdMinusDays } from "@/lib/invitation-view-stats";

const MEDIA_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".mp4",
  ".mov",
  ".webm",
]);

const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm"]);

async function collectGuestMedia(invitationIds: string[]): Promise<GuestMediaItem[]> {
  const result: GuestMediaItem[] = [];
  const baseDir = path.join(process.cwd(), "public", "uploads");

  for (const invitationId of invitationIds) {
    const invitationDir = path.join(baseDir, invitationId);
    let folders: Dirent[] = [];
    try {
      folders = await readdir(invitationDir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const folder of folders) {
      if (!folder.isDirectory()) continue;
      const folderPath = path.join(invitationDir, folder.name);
      let files: Dirent[] = [];
      try {
        files = await readdir(folderPath, { withFileTypes: true });
      } catch {
        continue;
      }

      for (const file of files) {
        if (!file.isFile()) continue;
        const ext = path.extname(file.name).toLowerCase();
        if (!MEDIA_EXTENSIONS.has(ext)) continue;
        const filePath = path.join(folderPath, file.name);
        const fileStat = await stat(filePath).catch(() => null);
        if (!fileStat) continue;
        const uploadedByRaw = folder.name.split("-")[0] ?? "";
        const uploadedBy = uploadedByRaw.trim() || "이름 미확인";

        result.push({
          invitationId,
          fileName: file.name,
          uploadedAt: fileStat.mtime.toISOString(),
          url: `/uploads/${invitationId}/${folder.name}/${file.name}`,
          kind: VIDEO_EXTENSIONS.has(ext) ? "video" : "image",
          uploadedBy,
          sizeBytes: fileStat.size,
        });
      }
    }
  }

  return result
    .sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1))
    .slice(0, 60);
}

export default async function MyPage() {
  const authUser = await requireUser("/mypage");
  const user = await syncUserProfile(authUser);
  const providerLabels: Record<string, string> = {
    kakao: "카카오",
    google: "구글",
    naver: "네이버",
  };
  const rawProviders = Array.isArray(authUser.app_metadata?.providers)
    ? (authUser.app_metadata.providers as string[])
    : [];
  const normalizedProviders = rawProviders
    .map((p) => String(p).toLowerCase())
    .filter((p) => p === "kakao" || p === "google" || p === "naver");
  const providerDisplay =
    normalizedProviders.length > 0
      ? normalizedProviders.map((p) => providerLabels[p] ?? p).join(", ")
      : "확인 불가";

  const [invitations, payments] = await Promise.all([
    prisma.invitation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    prisma.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ]);

  const invitationIds = invitations.map((i) => i.id);
  const todayYmd = getSeoulYmd();
  const last7StatDates = Array.from({ length: 7 }, (_, i) => seoulYmdMinusDays(todayYmd, i));

  const dailyRows =
    invitationIds.length === 0
      ? []
      : await prisma.invitationDailyView.findMany({
          where: {
            invitationId: { in: invitationIds },
            statDate: { in: last7StatDates },
          },
        });

  const viewsByInvitation = new Map<string, { today: number; last7: number }>();
  for (const id of invitationIds) {
    viewsByInvitation.set(id, { today: 0, last7: 0 });
  }
  for (const row of dailyRows) {
    const cur = viewsByInvitation.get(row.invitationId);
    if (!cur) continue;
    cur.last7 += row.views;
    if (row.statDate === todayYmd) cur.today += row.views;
  }

  const invitationItems: MyInvitationItem[] = invitations.map((invitation) => {
    const v = viewsByInvitation.get(invitation.id) ?? { today: 0, last7: 0 };
    const content =
      invitation.content && typeof invitation.content === "object"
        ? (invitation.content as Record<string, unknown>)
        : null;
    const guestUpload =
      content && content.guestUpload && typeof content.guestUpload === "object"
        ? (content.guestUpload as Record<string, unknown>)
        : null;
    const storageGbRaw = Number(guestUpload?.storageGb ?? 2);
    const storageGb = Number.isFinite(storageGbRaw) && storageGbRaw > 0 ? storageGbRaw : 2;
    return {
      id: invitation.id,
      title: invitation.title,
      code: invitation.code,
      deleteAt: invitation.expiresAt ? invitation.expiresAt.toISOString().slice(0, 10) : "미정",
      status: invitation.status === "PUBLISHED" ? "결제 완료" : "결제 전",
      publicViewCount: invitation.publicViewCount,
      viewsToday: v.today,
      viewsLast7Days: v.last7,
      lastPublicViewAt: invitation.lastPublicViewAt
        ? invitation.lastPublicViewAt.toISOString()
        : null,
      guestUploadStorageGb: storageGb,
    };
  });

  const paymentItems: MyPaymentItem[] = payments.map((payment) => ({
    id: payment.orderId,
    product: payment.invitationId ? "워터마크 제거" : "서비스 결제",
    amount: `${payment.amount.toLocaleString("ko-KR")}원`,
    status:
      payment.status === "PAID"
        ? "결제 완료"
        : payment.status === "REFUNDED"
          ? "환불 완료"
          : payment.status === "FAILED"
            ? "결제 실패"
            : payment.status === "CANCELED"
              ? "결제 취소"
              : "결제 대기",
    date: payment.createdAt.toISOString().slice(0, 10),
  }));

  const guestMedia = await collectGuestMedia(invitationIds);
  const accountPhone =
    (typeof authUser.phone === "string" && authUser.phone.trim()) ||
    (typeof authUser.user_metadata?.phone === "string" && authUser.user_metadata.phone.trim()) ||
    "";

  return (
    <MyPageClient
      invitations={invitationItems}
      payments={paymentItems}
      guestMedia={guestMedia}
      displayName={user.name || authUser.email || "사용자"}
      accountEmail={user.email || authUser.email || ""}
      accountProvider={providerDisplay}
      accountPhone={accountPhone}
    />
  );
}
