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
   * 신랑/신부가 지정한 업로드 대상 식별자(청첩장 ID).
   * 현재는 백엔드 연결이 모킹 상태이므로 제출 시 로그에 포함됩니다.
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
      alert(`한 번에 최대 ${maxFilesPerUpload}개까지 업로드할 수 있습니다.`);
      resetFiles();
      return;
    }

    const totalBytes = files.reduce((sum, f) => sum + (f.size || 0), 0);
    if (totalBytes > maxTotalBytes) {
      // 요구사항의 문구를 그대로 사용
      alert("남은 용량(50MB)을 초과했습니다. 첨부 파일을 줄여주세요.");
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
      // 제출 차단: 이름이 비어있으면 업로드하지 않음
      return;
    }
    if (selectedFiles.length === 0) {
      // 제출 차단: 첨부 파일이 없으면 업로드하지 않음
      return;
    }

    const totalBytes = selectedFiles.reduce((sum, f) => sum + (f.size || 0), 0);

    // 요구사항: 현재 백엔드가 연결되지 않았으므로 모킹만 수행
    // eslint-disable-next-line no-console
    console.log("Guest upload submit (mock)", {
      invitationId,
      senderName: name,
      files: selectedFiles,
      totalBytes,
    });

    setIsSubmitting(true);
    try {
      alert("업로드가 완료되었습니다.");
      resetFiles();
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

      {/* 파일 미리보기/목록 UI는 요구사항에 따라 생략 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.currentTarget.files ?? []);
          handleFilesSelected(files);
          // 같은 파일을 다시 선택해도 onChange가 동작하도록 초기화
          e.currentTarget.value = "";
        }}
      />

      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          // UX: 파일이 없으면 파일 선택창부터 열고, 선택이 있으면 제출로 동작
          if (senderName.trim().length === 0) return;
          if (selectedFiles.length === 0) {
            openFilePicker();
            return;
          }
          void handleUploadSubmit();
        }}
        disabled={isSubmitting}
        className="h-9 px-3 rounded-lg text-[13px] font-medium shadow-none"
      >
        {isSubmitting ? "업로드 중..." : "업로드"}
      </Button>

      {/* 요구사항: 추가 텍스트/파일 목록은 불필요. */}
    </div>
  );
}

