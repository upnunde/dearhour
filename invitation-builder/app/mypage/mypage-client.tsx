"use client";

import AppHeader from "@/components/AppHeader";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export type MyInvitationItem = {
  id: string;
  title: string;
  code: string;
  deleteAt: string;
  status: string;
  publicViewCount: number;
  viewsToday: number;
  viewsLast7Days: number;
  lastPublicViewAt: string | null;
  guestUploadStorageGb: number;
};

export type MyPaymentItem = {
  id: string;
  product: string;
  amount: string;
  status: string;
  date: string;
};

export type GuestMediaItem = {
  invitationId: string;
  fileName: string;
  url: string;
  uploadedAt: string;
  kind: "image" | "video";
  uploadedBy: string;
  sizeBytes: number;
};

export type MyRsvpItem = {
  id: string;
  invitationId: string;
  invitationTitle: string;
  side: string;
  intent: string;
  guestName: string;
  companionCount: number;
  createdAt: string;
};

type MainMenuKey = "manage" | "profile" | "payment" | "support";
type PaymentSubMenuKey = "history" | "coupon";
type SupportSubMenuKey = "inquiry" | "faq" | "policy";

function formatKstDateTime(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function formatBytes(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"] as const;
  let size = value;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function normalizeRoute(
  menuRaw: string | null,
  subRaw: string | null,
): { menu: MainMenuKey; sub: PaymentSubMenuKey | SupportSubMenuKey | null } {
  const menu = (menuRaw ?? "manage").toLowerCase();
  if (menu === "payment") {
    const sub = (subRaw ?? "history").toLowerCase();
    return { menu: "payment", sub: sub === "coupon" ? "coupon" : "history" };
  }
  if (menu === "support") {
    const sub = (subRaw ?? "inquiry").toLowerCase();
    if (sub === "faq") return { menu: "support", sub: "faq" };
    if (sub === "policy") return { menu: "support", sub: "policy" };
    return { menu: "support", sub: "inquiry" };
  }
  if (menu === "profile") return { menu: "profile", sub: null };
  return { menu: "manage", sub: null };
}

function buildMyPageHref(
  menu: MainMenuKey,
  sub?: PaymentSubMenuKey | SupportSubMenuKey | null,
): string {
  const params = new URLSearchParams();
  params.set("menu", menu);
  if (sub) params.set("sub", sub);
  return `/mypage?${params.toString()}`;
}

export default function MyPageClient({
  invitations,
  payments,
  guestMedia,
  displayName,
  accountEmail,
  accountProvider,
  accountPhone,
}: {
  invitations: MyInvitationItem[];
  payments: MyPaymentItem[];
  guestMedia: GuestMediaItem[];
  displayName: string;
  accountEmail: string;
  accountProvider: string;
  accountPhone: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const route = useMemo(
    () => normalizeRoute(searchParams.get("menu"), searchParams.get("sub")),
    [searchParams],
  );
  const [activeMenu, setActiveMenu] = useState<MainMenuKey>(route.menu);
  const [activeSubMenu, setActiveSubMenu] = useState<
    PaymentSubMenuKey | SupportSubMenuKey | null
  >(route.sub);

  const [shareModalInvitation, setShareModalInvitation] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [selectedShareVariant, setSelectedShareVariant] = useState<
    "basic" | "friends" | "family" | "coworkers"
  >("basic");
  const [selectedInvitationId, setSelectedInvitationId] = useState<string | null>(
    null,
  );
  const [detailTab, setDetailTab] = useState<"stats" | "rsvp" | "guestMedia">(
    "stats",
  );
  const [guestMediaSortKey, setGuestMediaSortKey] = useState<
    "date" | "name" | "kind"
  >("date");

  useEffect(() => {
    setActiveMenu(route.menu);
    setActiveSubMenu(route.sub);
    const canonical = buildMyPageHref(route.menu, route.sub);
    const current = `/mypage${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    if (current !== canonical) {
      router.replace(canonical);
    }
  }, [route, router, searchParams]);

  const goMenu = (menu: MainMenuKey, sub?: PaymentSubMenuKey | SupportSubMenuKey | null) => {
    router.push(buildMyPageHref(menu, sub));
  };

  const handleShareCopy = async () => {
    if (!shareModalInvitation) return;
    const variantPath: Record<typeof selectedShareVariant, string> = {
      basic: "basic",
      friends: "friends",
      family: "family",
      coworkers: "coworkers",
    };
    const shareUrl = `${window.location.origin}/preview/${shareModalInvitation.id}?public=1&v=${variantPath[selectedShareVariant]}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      window.alert("공유 링크가 복사되었습니다.\n하객에게 바로 전달해 보세요.");
      setShareModalInvitation(null);
    } catch {
      window.alert(
        `공유 링크를 복사하지 못했습니다.\n아래 링크를 직접 복사해 주세요.\n${shareUrl}`,
      );
    }
  };

  const selectedInvitation = useMemo(
    () => invitations.find((item) => item.id === selectedInvitationId) ?? null,
    [invitations, selectedInvitationId],
  );
  const selectedGuestMedia = useMemo(
    () => guestMedia.filter((item) => item.invitationId === selectedInvitationId),
    [guestMedia, selectedInvitationId],
  );

  const sortedGuestMedia = useMemo(() => {
    const items = [...selectedGuestMedia];
    items.sort((a, b) => {
      if (guestMediaSortKey === "name") {
        return `${a.uploadedBy} ${a.fileName}`.localeCompare(
          `${b.uploadedBy} ${b.fileName}`,
          "ko",
        );
      }
      if (guestMediaSortKey === "kind") {
        const order = a.kind === b.kind ? 0 : a.kind === "image" ? -1 : 1;
        if (order !== 0) return order;
      }
      return a.uploadedAt < b.uploadedAt ? 1 : -1;
    });
    return items;
  }, [selectedGuestMedia, guestMediaSortKey]);

  const usedStorageBytes = useMemo(
    () =>
      selectedGuestMedia.reduce(
        (sum, item) => sum + Math.max(0, item.sizeBytes || 0),
        0,
      ),
    [selectedGuestMedia],
  );
  const capacityBytes = Math.max(
    1,
    (selectedInvitation?.guestUploadStorageGb ?? 2) * 1024 * 1024 * 1024,
  );
  const usedStoragePercent = Math.min(
    100,
    Math.round((usedStorageBytes / capacityBytes) * 100),
  );

  return (
    <>
      <AppHeader />
      <main className="min-h-[calc(100vh-64px)] bg-white px-6 py-12">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-[#111]">마이페이지</h1>
            <p className="mt-1 text-sm text-[#6b7280]">{displayName}님의 내역을 관리합니다.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="rounded-lg border border-[#efefef] p-3">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => goMenu("manage")}
                  className={`flex h-10 w-full items-center rounded-md px-3 text-sm font-medium transition-colors ${
                    activeMenu === "manage"
                      ? "bg-[#111] text-white"
                      : "text-[#4b5563] hover:bg-[#f8f8f8]"
                  }`}
                >
                  제작관리
                </button>
                <button
                  type="button"
                  onClick={() => goMenu("profile")}
                  className={`flex h-10 w-full items-center rounded-md px-3 text-sm font-medium transition-colors ${
                    activeMenu === "profile"
                      ? "bg-[#111] text-white"
                      : "text-[#4b5563] hover:bg-[#f8f8f8]"
                  }`}
                >
                  나의정보
                </button>
              </div>

              <div className="mt-4 space-y-1 border-t border-[#efefef] pt-3">
                <button
                  type="button"
                  onClick={() => goMenu("payment", "history")}
                  className={`flex h-10 w-full items-center rounded-md px-3 text-sm font-medium transition-colors ${
                    activeMenu === "payment"
                      ? "bg-[#f8f8f8] text-[#111]"
                      : "text-[#4b5563] hover:bg-[#f8f8f8]"
                  }`}
                >
                  결제
                </button>
                <div className="pl-3">
                  <button
                    type="button"
                    onClick={() => goMenu("payment", "history")}
                    className={`flex h-9 w-full items-center rounded-md px-3 text-sm transition-colors ${
                      activeMenu === "payment" && activeSubMenu === "history"
                        ? "font-semibold text-[#111]"
                        : "text-[#6b7280] hover:bg-[#f8f8f8] hover:text-[#4b5563]"
                    }`}
                  >
                    결제내역
                  </button>
                  <button
                    type="button"
                    onClick={() => goMenu("payment", "coupon")}
                    className={`flex h-9 w-full items-center rounded-md px-3 text-sm transition-colors ${
                      activeMenu === "payment" && activeSubMenu === "coupon"
                        ? "font-semibold text-[#111]"
                        : "text-[#6b7280] hover:bg-[#f8f8f8] hover:text-[#4b5563]"
                    }`}
                  >
                    쿠폰
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-1 border-t border-[#efefef] pt-3">
                <button
                  type="button"
                  onClick={() => goMenu("support", "inquiry")}
                  className={`flex h-10 w-full items-center rounded-md px-3 text-sm font-medium transition-colors ${
                    activeMenu === "support"
                      ? "bg-[#f8f8f8] text-[#111]"
                      : "text-[#4b5563] hover:bg-[#f8f8f8]"
                  }`}
                >
                  고객지원
                </button>
                <div className="pl-3">
                  <button
                    type="button"
                    onClick={() => goMenu("support", "inquiry")}
                    className={`flex h-9 w-full items-center rounded-md px-3 text-sm transition-colors ${
                      activeMenu === "support" && activeSubMenu === "inquiry"
                        ? "font-semibold text-[#111]"
                        : "text-[#6b7280] hover:bg-[#f8f8f8] hover:text-[#4b5563]"
                    }`}
                  >
                    1:1문의
                  </button>
                  <button
                    type="button"
                    onClick={() => goMenu("support", "faq")}
                    className={`flex h-9 w-full items-center rounded-md px-3 text-sm transition-colors ${
                      activeMenu === "support" && activeSubMenu === "faq"
                        ? "font-semibold text-[#111]"
                        : "text-[#6b7280] hover:bg-[#f8f8f8] hover:text-[#4b5563]"
                    }`}
                  >
                    자주묻는 질문
                  </button>
                  <button
                    type="button"
                    onClick={() => goMenu("support", "policy")}
                    className={`flex h-9 w-full items-center rounded-md px-3 text-sm transition-colors ${
                      activeMenu === "support" && activeSubMenu === "policy"
                        ? "font-semibold text-[#111]"
                        : "text-[#6b7280] hover:bg-[#f8f8f8] hover:text-[#4b5563]"
                    }`}
                  >
                    이용약관 및 정책
                  </button>
                </div>
              </div>
            </aside>

            <section>
              {activeMenu === "manage" ? (
                <>
                  {selectedInvitation ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#ececec] bg-white px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-[#111]">
                            {selectedInvitation.title}
                          </p>
                          <p className="mt-1 text-xs text-[#6b7280]">
                            개별 알림장 상세정보 (Depth 2)
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedInvitationId(null)}
                          className="inline-flex h-9 items-center rounded-md border border-[#dedede] bg-white px-3 text-sm font-medium text-[#111] hover:bg-[#f7f7f7]"
                        >
                          목록으로
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setDetailTab("stats")}
                          className={`inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold transition-colors ${
                            detailTab === "stats"
                              ? "bg-[#111] text-white"
                              : "border border-[#e5e7eb] bg-white text-[#4b5563] hover:bg-[#f8f8f8]"
                          }`}
                        >
                          방문자 통계
                        </button>
                        <button
                          type="button"
                          onClick={() => setDetailTab("rsvp")}
                          className={`inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold transition-colors ${
                            detailTab === "rsvp"
                              ? "bg-[#111] text-white"
                              : "border border-[#e5e7eb] bg-white text-[#4b5563] hover:bg-[#f8f8f8]"
                          }`}
                        >
                          참석 응답
                        </button>
                        <button
                          type="button"
                          onClick={() => setDetailTab("guestMedia")}
                          className={`inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold transition-colors ${
                            detailTab === "guestMedia"
                              ? "bg-[#111] text-white"
                              : "border border-[#e5e7eb] bg-white text-[#4b5563] hover:bg-[#f8f8f8]"
                          }`}
                        >
                          하객 사진
                        </button>
                      </div>

                      {detailTab === "stats" ? (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          <div className="rounded-lg border border-[#ececec] bg-[#fafafa] px-4 py-3">
                            <p className="text-xs font-medium text-[#6b7280]">누적 조회</p>
                            <p className="mt-1 text-xl font-semibold tabular-nums text-[#111]">
                              {selectedInvitation.publicViewCount.toLocaleString("ko-KR")}회
                            </p>
                          </div>
                          <div className="rounded-lg border border-[#ececec] bg-[#fafafa] px-4 py-3">
                            <p className="text-xs font-medium text-[#6b7280]">오늘(서울)</p>
                            <p className="mt-1 text-xl font-semibold tabular-nums text-[#111]">
                              {selectedInvitation.viewsToday.toLocaleString("ko-KR")}회
                            </p>
                          </div>
                          <div className="rounded-lg border border-[#ececec] bg-[#fafafa] px-4 py-3">
                            <p className="text-xs font-medium text-[#6b7280]">최근 7일</p>
                            <p className="mt-1 text-xl font-semibold tabular-nums text-[#111]">
                              {selectedInvitation.viewsLast7Days.toLocaleString("ko-KR")}회
                            </p>
                          </div>
                          <div className="rounded-lg border border-[#ececec] bg-[#fafafa] px-4 py-3">
                            <p className="text-xs font-medium text-[#6b7280]">마지막 조회</p>
                            <p className="mt-1 text-sm font-semibold text-[#111]">
                              {formatKstDateTime(selectedInvitation.lastPublicViewAt)}
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {detailTab === "rsvp" ? (
                        <div className="rounded-lg border border-[#efefef] bg-[#fafafa] px-4 py-8 text-center text-sm text-[#6b7280]">
                          참석 응답은 준비 중입니다.
                        </div>
                      ) : null}

                      {detailTab === "guestMedia" ? (
                        <div className="space-y-4">
                          <div className="rounded-lg border border-[#ececec] bg-white p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold text-[#111]">용량 정보</p>
                                <p className="mt-1 text-sm text-[#6b7280]">
                                  {formatBytes(usedStorageBytes)} /{" "}
                                  {selectedInvitation.guestUploadStorageGb} GB 사용 중
                                  <span className="ml-1 tabular-nums">
                                    ({usedStoragePercent}%)
                                  </span>
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  window.alert("용량 추가 구매는 준비 중입니다.")
                                }
                                className="inline-flex h-9 items-center rounded-md border border-[#dedede] bg-white px-3 text-sm font-medium text-[#111] hover:bg-[#f7f7f7]"
                              >
                                + 추가
                              </button>
                            </div>
                            <div className="mt-3 h-2 rounded-full bg-[#f2f2f2]">
                              <div
                                className="h-2 rounded-full bg-[#111] transition-[width]"
                                style={{ width: `${usedStoragePercent}%` }}
                                aria-hidden
                              />
                            </div>
                          </div>

                          <div className="rounded-lg border border-[#ececec] bg-white p-4">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                              <span className="text-sm font-medium text-[#4b5563]">정렬</span>
                              <select
                                value={guestMediaSortKey}
                                onChange={(e) =>
                                  setGuestMediaSortKey(
                                    e.target.value as "date" | "name" | "kind",
                                  )
                                }
                                className="h-10 rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm text-[#4b5563] outline-none"
                              >
                                <option value="date">날짜순</option>
                                <option value="name">이름순</option>
                                <option value="kind">종류순(사진/영상)</option>
                              </select>
                            </div>

                            {sortedGuestMedia.length === 0 ? (
                              <div className="rounded-lg border border-[#efefef] bg-[#fafafa] px-4 py-8 text-center text-sm text-[#6b7280]">
                                아직 하객이 업로드한 사진/영상이 없습니다.
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                {sortedGuestMedia.map((item) => (
                                  <article
                                    key={`${item.url}-${item.uploadedAt}`}
                                    className="overflow-hidden rounded-lg border border-[#ececec] bg-white"
                                  >
                                    {item.kind === "image" ? (
                                      <Image
                                        src={item.url}
                                        alt={item.fileName}
                                        width={320}
                                        height={240}
                                        className="h-32 w-full object-cover"
                                      />
                                    ) : (
                                      <video
                                        src={item.url}
                                        className="h-32 w-full object-cover"
                                        controls
                                        preload="metadata"
                                      />
                                    )}
                                    <div className="px-2 py-2">
                                      <p className="truncate text-sm text-[#4b5563]">
                                        {item.fileName}
                                      </p>
                                      <p className="mt-0.5 text-sm text-[#9ca3af]">
                                        {formatKstDateTime(item.uploadedAt)} · {item.uploadedBy}
                                      </p>
                                    </div>
                                  </article>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : invitations.length === 0 ? (
                    <div className="rounded-lg border border-[#efefef] bg-[#fafafa] px-4 py-8 text-center text-sm text-[#6b7280]">
                      아직 저장된 초대장이 없습니다.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {invitations.map((invitation) => (
                        <article
                          key={invitation.id}
                          className="flex flex-wrap items-center gap-4 rounded-lg border border-[#ececec] bg-white p-4"
                        >
                          <div className="h-24 w-40 overflow-hidden rounded-md border border-[#e5e7eb] bg-white">
                            <Image
                              src="/flower01.svg"
                              alt={`${invitation.title} 썸네일`}
                              width={160}
                              height={96}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="min-w-[170px] flex-1">
                            <h3 className="text-lg font-semibold text-[#111]">
                              {invitation.title}
                            </h3>
                            <p className="mt-2 text-sm text-[#6b7280]">
                              삭제 예정일: {invitation.deleteAt}
                            </p>
                            <p className="mt-1 text-sm text-[#6b7280]">
                              상태: {invitation.status}
                            </p>
                          </div>

                          <div className="ml-auto flex flex-wrap items-center gap-2">
                            <Link
                              href={`/editor?invitationId=${invitation.id}`}
                              className="inline-flex h-10 items-center rounded-md border border-[#dedede] bg-white px-4 text-sm font-medium text-[#111] hover:bg-[#f7f7f7]"
                            >
                              편집
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                if (invitation.status === "결제 완료") {
                                  setShareModalInvitation({
                                    id: invitation.id,
                                    title: invitation.title,
                                  });
                                  setSelectedShareVariant("basic");
                                  return;
                                }
                                window.alert(
                                  "공유하기는 결제 완료 후 사용할 수 있습니다.",
                                );
                              }}
                              className="inline-flex h-10 items-center rounded-md border border-[#dedede] bg-white px-4 text-sm font-medium text-[#111] hover:bg-[#f7f7f7]"
                            >
                              공유
                            </button>
                            <Link
                              href={`/preview/${invitation.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-10 items-center rounded-md border border-[#dedede] bg-white px-4 text-sm font-medium text-[#111] hover:bg-[#f7f7f7]"
                            >
                              미리보기
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedInvitationId(invitation.id);
                                setDetailTab("stats");
                              }}
                              className="inline-flex h-10 items-center rounded-md border border-[#dedede] bg-white px-4 text-sm font-medium text-[#111] hover:bg-[#f7f7f7]"
                            >
                              상세보기
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </>
              ) : activeMenu === "profile" ? (
                <section className="space-y-3">
                  <div className="rounded-lg border border-[#efefef] p-4">
                    <p className="text-sm font-semibold text-[#111]">계정정보</p>
                    <p className="mt-2 text-sm text-[#6b7280]">
                      로그인 방식: {accountProvider}
                    </p>
                    <p className="mt-1 text-sm text-[#6b7280]">이름: {displayName}</p>
                    <p className="mt-1 text-sm text-[#6b7280]">
                      이메일: {accountEmail || "정보 없음"}
                    </p>
                    <p className="mt-1 text-sm text-[#6b7280]">
                      전화번호: {accountPhone || "정보 없음"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await fetch("/api/auth/logout", { method: "POST" });
                        } finally {
                          window.location.assign("/login");
                        }
                      }}
                      className="inline-flex h-10 items-center rounded-md border border-[#dedede] bg-white px-4 text-sm font-medium text-[#111] hover:bg-[#f7f7f7]"
                    >
                      로그아웃
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        window.alert(
                          "회원탈퇴 기능은 준비 중입니다. 고객지원의 1:1 문의로 요청해 주세요.",
                        )
                      }
                      className="inline-flex h-10 items-center rounded-md border border-[#dedede] bg-white px-4 text-sm font-medium text-[#111] hover:bg-[#f7f7f7]"
                    >
                      회원탈퇴
                    </button>
                  </div>
                </section>
              ) : activeMenu === "payment" && activeSubMenu === "history" ? (
                <section>
                  {payments.length === 0 ? (
                    <div className="rounded-lg border border-[#efefef] bg-[#fafafa] px-4 py-8 text-center text-sm text-[#6b7280]">
                      아직 결제내역이 없습니다.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#efefef] p-4"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[#111]">
                              {payment.product}
                            </p>
                            <p className="mt-1 text-sm text-[#6b7280]">
                              주문번호 {payment.id} · {payment.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-[#111]">
                              {payment.amount}
                            </p>
                            <p className="mt-1 text-sm text-[#6b7280]">
                              {payment.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ) : activeMenu === "payment" && activeSubMenu === "coupon" ? (
                <section className="space-y-3">
                  <div className="rounded-lg border border-[#efefef] bg-[#fafafa] px-4 py-8 text-center text-sm text-[#6b7280]">
                    현재 보유한 쿠폰이 없습니다.
                  </div>
                </section>
              ) : activeMenu === "support" && activeSubMenu === "inquiry" ? (
                <section className="space-y-3">
                  <div className="rounded-lg border border-[#efefef] p-4">
                    <p className="text-sm font-semibold text-[#111]">1:1 문의</p>
                    <p className="mt-2 text-sm text-[#6b7280]">
                      이메일: support@dearhour.co
                    </p>
                  </div>
                </section>
              ) : activeMenu === "support" && activeSubMenu === "faq" ? (
                <section className="space-y-3">
                  <div className="rounded-lg border border-[#efefef] p-4">
                    <p className="text-sm font-semibold text-[#111]">자주묻는 질문</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#6b7280]">
                      <li>알림장은 계정당 최대 30개까지 만들 수 있습니다.</li>
                      <li>공유 링크는 제작관리 카드의 공유 버튼에서 확인할 수 있습니다.</li>
                    </ul>
                  </div>
                </section>
              ) : (
                <section className="space-y-3">
                  <div className="rounded-lg border border-[#efefef] p-4">
                    <p className="text-sm font-semibold text-[#111]">
                      이용약관 및 정책
                    </p>
                    <p className="mt-2 text-sm text-[#6b7280]">
                      이용약관, 개인정보처리방침, 환불 정책을 확인할 수 있습니다.
                    </p>
                  </div>
                </section>
              )}
            </section>
          </div>
        </div>

        {shareModalInvitation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
              <h3 className="text-lg font-semibold text-[#111]">공유 링크 선택</h3>
              <p className="mt-1 text-sm text-[#6b7280]">
                {shareModalInvitation.title}에 사용할 링크 타입을 선택해 주세요.
              </p>

              <div className="mt-4 space-y-2">
                {[
                  { id: "basic", label: "기본 링크" },
                  { id: "friends", label: "지인용 링크" },
                  { id: "family", label: "부모님/친척용 링크" },
                  { id: "coworkers", label: "직장동료용 링크" },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setSelectedShareVariant(
                        option.id as typeof selectedShareVariant,
                      )
                    }
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-3 text-left text-sm transition-colors ${
                      selectedShareVariant === option.id
                        ? "border-[#111] bg-[#111] text-white"
                        : "border-[#e5e7eb] bg-white text-[#111] hover:bg-[#f9fafb]"
                    }`}
                  >
                    <span>{option.label}</span>
                    {selectedShareVariant === option.id && <span>선택됨</span>}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShareModalInvitation(null)}
                  className="inline-flex h-10 items-center rounded-lg border border-[#e5e7eb] px-4 text-sm font-medium text-[#4b5563] hover:bg-[#f9fafb]"
                >
                  닫기
                </button>
                <button
                  type="button"
                  onClick={() => void handleShareCopy()}
                  className="inline-flex h-10 items-center rounded-lg bg-[#111] px-4 text-sm font-semibold text-white hover:bg-black"
                >
                  URL 복사
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
