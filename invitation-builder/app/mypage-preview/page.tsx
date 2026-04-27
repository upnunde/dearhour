import MyPageClient, {
  type GuestMediaItem,
  type MyInvitationItem,
  type MyPaymentItem,
} from "@/app/mypage/mypage-client";

export const dynamic = "force-static";

const demoInvitations: MyInvitationItem[] = [
  {
    id: "demo_invitation_paid",
    title: "민수 & 지은 결혼식",
    code: "AB12CD",
    deleteAt: "2026-09-30",
    status: "결제 완료",
    publicViewCount: 128,
    viewsToday: 4,
    viewsLast7Days: 31,
    lastPublicViewAt: "2026-04-23T06:30:00.000Z",
    guestUploadStorageGb: 5,
  },
  {
    id: "demo_invitation_draft",
    title: "현우 & 수빈 모바일 청첩장",
    code: "EF34GH",
    deleteAt: "2026-08-15",
    status: "결제 전",
    publicViewCount: 12,
    viewsToday: 0,
    viewsLast7Days: 5,
    lastPublicViewAt: null,
    guestUploadStorageGb: 2,
  },
];

const demoPayments: MyPaymentItem[] = [
  {
    id: "order_demo_001",
    product: "워터마크 제거",
    amount: "9,900원",
    status: "결제 완료",
    date: "2026-04-22",
  },
  {
    id: "order_demo_002",
    product: "서비스 결제",
    amount: "14,900원",
    status: "결제 대기",
    date: "2026-04-20",
  },
];

const demoGuestMedia: GuestMediaItem[] = [
  {
    invitationId: "demo_invitation_paid",
    fileName: "guest-photo-01.jpg",
    url: "/flower01.svg",
    uploadedAt: "2026-04-21T10:30:00.000Z",
    kind: "image",
    uploadedBy: "김하객",
    sizeBytes: 1_024_000,
  },
  {
    invitationId: "demo_invitation_paid",
    fileName: "guest-photo-02.jpg",
    url: "/flower01.svg",
    uploadedAt: "2026-04-20T09:15:00.000Z",
    kind: "image",
    uploadedBy: "이하객",
    sizeBytes: 2_345_000,
  },
];

export default function MyPagePreviewPage() {
  return (
    <MyPageClient
      invitations={demoInvitations}
      payments={demoPayments}
      guestMedia={demoGuestMedia}
      displayName="디자인 미리보기"
      accountEmail="preview@dearhour.co"
      accountProvider="카카오, 구글"
      accountPhone="010-1234-5678"
    />
  );
}
