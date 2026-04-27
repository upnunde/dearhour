"use client";

import React, { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type GuestPhotoUploadFormProps = {
  /**
   * 총 용량 제한(MB).
   * 요구사항: 임시로 50MB 고정이지만, 테스트/추후 변경을 위해 prop으로 노출합니다.
   */
  maxTotalMB?: number;
  /**
   * 1회 업로드 최대 파일 개수(옵션).
   */
  maxFilesPerUpload?: number;
  /**
   * 서버에 저장될 청첩장 ID (`/editor?invitationId=...` 등).
   * 없으면 업로드 API를 호출하지 않습니다.
   */
  invitationId?: string;
};

export default function GuestPhotoUploadForm({
  maxTotalMB = 50,
  maxFilesPerUpload,
  invitationId,
}: GuestPhotoUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [senderName, setSenderName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxTotalBytes = useMemo(() => maxTotalMB * 1024 * 1024, [maxTotalMB]);
  const hasInvitation = !!(invitationId && invitationId.trim());

  const resetFiles = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) {
      resetFiles();
      return;
    }

    if (typeof maxFilesPerUpload === "number" && maxFilesPerUpload > 0 && files.length > maxFilesPerUpload) {
      window.alert(`한 번에 최대 ${maxFilesPerUpload}개까지 업로드할 수 있습니다.`);
      resetFiles();
      return;
    }

    const totalBytes = files.reduce((sum, f) => sum + (f.size || 0), 0);
    if (totalBytes > maxTotalBytes) {
      window.alert(`남은 용량(${maxTotalMB}MB)을 초과했습니다. 첨부 파일을 줄여주세요.`);
      resetFiles();
      return;
    }

    setSelectedFiles(files);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleUploadSubmit = async () => {
    if (isSubmitting) return;

    const name = senderName.trim();
    if (!name) {
      return;
    }
    if (selectedFiles.length === 0) {
      return;
    }
    if (!hasInvitation) {
      window.alert(
        "하객 업로드는 저장된 청첩장이 있어야 합니다. 마이페이지에서 이 청첩장을 연 뒤(주소에 invitationId가 포함된 상태) 다시 시도해 주세요.",
      );
      return;
    }

    const formData = new FormData();
    formData.append("guestName", name);
    formData.append("invitationId", invitationId.trim());
    for (const file of selectedFiles) {
      formData.append("files", file);
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/guest-media-upload", {
        method: "POST",
        body: formData,
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok) {
        window.alert(json?.error ?? "업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }
      window.alert("업로드가 완료되었습니다.");
      setSenderName("");
      resetFiles();
    } catch {
      window.alert("네트워크 오류로 업로드에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-white p-3 space-y-2">
      <Input
        value={senderName}
        onChange={(e) => setSenderName(e.target.value)}
        placeholder="보내는 사람(이름)"
        className="shadow-none"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.currentTarget.files ?? []);
          handleFilesSelected(files);
          e.currentTarget.value = "";
        }}
      />

      {!hasInvitation ? (
        <p className="text-xs leading-relaxed text-on-surface-30">
          마이페이지에서 저장된 청첩장의 &quot;편집&quot;으로 들어온 경우에만 서버 업로드가 가능합니다.
        </p>
      ) : null}

      <Button
        type="button"
        variant="default"
        onClick={() => {
          if (senderName.trim().length === 0) return;
          if (selectedFiles.length === 0) {
            openFilePicker();
            return;
          }
          void handleUploadSubmit();
        }}
        disabled={isSubmitting || senderName.trim().length === 0}
        className="h-10 w-full px-3 rounded-lg text-sm font-medium shadow-none bg-[color:var(--key)] text-white hover:brightness-95 disabled:bg-[color:var(--key)]/40 disabled:text-white"
      >
        {isSubmitting ? "업로드 중..." : "사진, 영상 선택하기"}
      </Button>
    </div>
  );
}
