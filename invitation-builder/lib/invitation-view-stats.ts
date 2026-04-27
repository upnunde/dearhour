/** 청첩장 공개 미리보기 조회 집계용 — 날짜 경계는 Asia/Seoul */

export function getSeoulYmd(d = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value ?? "1970";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const day = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${day}`;
}

/** `ymd`(서울) 기준 `daysBefore`일 전의 서울 YMD */
export function seoulYmdMinusDays(ymd: string, daysBefore: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return ymd;
  const base = Date.UTC(y, m - 1, d, 12, 0, 0);
  return getSeoulYmd(new Date(base - daysBefore * 86_400_000));
}
