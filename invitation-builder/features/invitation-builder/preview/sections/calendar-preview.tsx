"use client";

import React from "react";
import type { DesignerCalendarCell } from "@/lib/designer-calendar";

const WEEKDAY_EN_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
const WEEKDAY_LETTERS_EN = ["S", "M", "T", "W", "T", "F", "S"] as const;
const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"] as const;

function parseKoreanTime(value: string | undefined | null) {
  const normalized = (value || "").trim().replace(/\s+/g, "");
  const match = normalized.match(/(오전|오후)?\s*(\d{1,2})(?::(\d{1,2}))?/);
  const period = (match?.[1] as "오전" | "오후" | undefined) ?? "오후";
  const hour = Number(match?.[2] ?? 12);
  const minute = String(Number(match?.[3] ?? 0)).padStart(2, "0");
  return { period, hour, minute };
}

function formatKoreanTimeSpaced(value: string | undefined | null): string {
  const v = (value || "").trim();
  if (!v) return "";
  const { period, hour, minute } = parseKoreanTime(v);
  const mm = Number(minute);
  if (Number.isFinite(mm) && mm > 0) return `${period} ${hour}시 ${minute}분`;
  return `${period} ${hour}시`;
}

function formatTimeEnglish12h(value: string | undefined | null): string {
  const { period, hour, minute } = parseKoreanTime(value);
  const h24 = period === "오전" ? (hour === 12 ? 0 : hour) : hour === 12 ? 12 : hour + 12;
  const ampm = h24 >= 12 ? "PM" : "AM";
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  return `${String(h12).padStart(2, "0")}:${minute} ${ampm}`;
}

function formatMonthEnglishUpper(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(date).toUpperCase();
}

export function normalizeCalendarDisplayType(raw: unknown): "A" | "B" | "C" {
  return raw === "B" || raw === "C" ? raw : "A";
}

type DesignerCalendarPreviewProps = {
  layout: "A" | "B" | "C";
  cells: DesignerCalendarCell[];
  eventDate: Date;
  timeRaw: string;
  useThemeColor?: boolean;
};

export function DesignerCalendarPreview({
  layout,
  cells,
  eventDate,
  timeRaw,
  useThemeColor = false,
}: DesignerCalendarPreviewProps) {
  const y = eventDate.getFullYear();
  const mo = eventDate.getMonth() + 1;
  const d = eventDate.getDate();
  const dow = eventDate.getDay();
  const dotYmd = `${y}.${mo}.${d}`;
  const yyMmDd = `${String(y).slice(-2)}.${String(mo).padStart(2, "0")}.${String(d).padStart(2, "0")}`;
  const weekdayLongKo = `${WEEKDAY_KO[dow]}요일`;
  const timeKo = formatKoreanTimeSpaced(timeRaw);
  const sublineA = timeKo.length > 0 ? `${weekdayLongKo} ${timeKo}` : weekdayLongKo;
  const timeEn = formatTimeEnglish12h(timeRaw);
  const monthEn = formatMonthEnglishUpper(eventDate);
  const weekLabels = layout === "A" ? WEEKDAY_LETTERS_EN : WEEKDAY_KO;
  const cellText = useThemeColor ? "text-[#413830]" : "text-neutral-700";
  const eventDayBg = useThemeColor ? "bg-[color:var(--key)]" : "bg-neutral-600";

  const cellShell = (cell: DesignerCalendarCell) => {
    const base =
      "w-10 h-10 shrink-0 rounded-[999px] p-2.5 inline-flex flex-col items-center justify-center text-center text-sm font-normal font-sans";
    if (!cell.day) {
      return <div key={cell.key} className={base} aria-hidden />;
    }
    if (cell.isEvent) {
      return (
        <div key={cell.key} className={`${base} ${eventDayBg} text-white`}>
          <span>{cell.day}</span>
        </div>
      );
    }
    return (
      <div key={cell.key} className={`${base} ${cellText}`}>
        <span>{cell.day}</span>
      </div>
    );
  };

  const weekRow = weekLabels.map((label, index) => (
    <div
      key={`w-${index}-${label}`}
      className={`w-10 h-10 shrink-0 rounded-[999px] p-2.5 inline-flex flex-col items-center justify-center text-center text-sm font-normal font-sans ${cellText}`}
    >
      <span>{label}</span>
    </div>
  ));

  const grid = (
    <div className="grid w-full grid-cols-7 gap-1 justify-items-center">
      {weekRow}
      {cells.map((cell) => cellShell(cell))}
    </div>
  );

  const topGap = layout === "B" ? "gap-10" : layout === "A" ? "gap-5" : "gap-3";
  const subMuted = useThemeColor ? "text-[#413830]/60" : "text-neutral-500";
  const headStrong = useThemeColor ? "text-[#413830]" : "text-neutral-900";
  const dividerClass = useThemeColor ? "bg-[#413830]/10" : "bg-black/10";
  const pipeClass = useThemeColor ? "bg-[#413830]/25" : "bg-zinc-300";

  let header: React.ReactNode = null;
  if (layout === "A") {
    header = (
      <div className="flex w-44 max-w-[11rem] flex-col items-center gap-1">
        <div className={`w-full text-center text-2xl font-bold ${headStrong}`}>{dotYmd}</div>
        <div className={`w-full text-center text-base font-light ${subMuted}`}>{sublineA}</div>
      </div>
    );
  } else if (layout === "B") {
    header = (
      <div className="flex flex-col items-center gap-3">
        <div className={`text-center text-3xl font-bold ${headStrong}`}>{monthEn}</div>
        <div className={`inline-flex items-center justify-center gap-2 text-base font-light ${subMuted}`}>
          <span>{yyMmDd}</span>
          <span className={`h-4 w-px ${pipeClass}`} aria-hidden />
          <span>{WEEKDAY_EN_SHORT[dow]}</span>
          {timeRaw.trim() ? (
            <>
              <span className={`h-4 w-px ${pipeClass}`} aria-hidden />
              <span>{timeEn}</span>
            </>
          ) : null}
        </div>
      </div>
    );
  } else {
    header = (
      <div className="flex flex-col items-center gap-3">
        <div className={`inline-flex items-center justify-center gap-4 text-3xl font-bold ${headStrong}`}>
          <span>{String(y).slice(-2)}</span>
          <span className={`h-6 w-px ${pipeClass}`} aria-hidden />
          <span>{String(mo).padStart(2, "0")}</span>
          <span className={`h-6 w-px ${pipeClass}`} aria-hidden />
          <span>{String(d).padStart(2, "0")}</span>
        </div>
        <div className={`w-full text-center text-base font-light ${subMuted}`}>
          {timeKo ? `${weekdayLongKo} ${timeKo}` : weekdayLongKo}
        </div>
      </div>
    );
  }

  const placeHeaderOutsideBody = layout === "C";
  const body = (
    <div className={`mx-auto flex w-full flex-col items-center py-0 px-0 ${topGap}`}>
      {layout !== "A" && !placeHeaderOutsideBody ? header : null}
      <div className={`h-px w-full ${dividerClass}`} aria-hidden />
      {grid}
      <div className={`h-px w-full ${dividerClass}`} aria-hidden />
    </div>
  );
  const previewWrapperClass =
    "relative mx-auto flex h-fit w-full max-w-[384px] flex-col items-center justify-start gap-10";

  if (layout === "A") {
    return (
      <>
        {header}
        <div className={previewWrapperClass}>{body}</div>
      </>
    );
  }

  return (
    <div className={previewWrapperClass}>
      {placeHeaderOutsideBody ? header : null}
      {body}
    </div>
  );
}
