"use client";

import { useEffect } from "react";

/**
 * 공개 미리보기 페이지에서 브라우저 탭(세션)당 1회 조회를 서버에 기록합니다.
 */
export default function InvitationPreviewViewTracker({ invitationId }: { invitationId: string }) {
  useEffect(() => {
    const id = String(invitationId ?? "").trim();
    if (!id || typeof window === "undefined") return;
    const key = `dh-inv-view:${id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage 불가 시에도 서버 측 IP 레이트리밋으로 완화
    }
    void fetch(`/api/invitations/${encodeURIComponent(id)}/view`, { method: "POST" }).catch(() => {});
  }, [invitationId]);

  return null;
}
