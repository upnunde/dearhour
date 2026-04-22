/** 워터마크 제거 결제: 기간별 금액(서버·클라이언트 공통, prepare에서만 최종 확정) */

export const WATERMARK_DURATION_IDS = ["3m", "5m", "12m"] as const;
export type WatermarkDurationId = (typeof WATERMARK_DURATION_IDS)[number];

export const WATERMARK_DURATION_OPTIONS: ReadonlyArray<{
  id: WatermarkDurationId;
  label: string;
  months: number;
  priceLabel: string;
}> = [
  { id: "3m", label: "3달", months: 3, priceLabel: "9,900원" },
  { id: "5m", label: "5달", months: 5, priceLabel: "14,900원" },
  { id: "12m", label: "1년", months: 12, priceLabel: "29,000원" },
];

const BASE_BY_ID: Record<WatermarkDurationId, number> = {
  "3m": 9900,
  "5m": 14900,
  "12m": 29000,
};

const PROMO_DEARHOUR2000_MAX = 2000;

export function isWatermarkDurationId(v: string): v is WatermarkDurationId {
  return (WATERMARK_DURATION_IDS as readonly string[]).includes(v);
}

export function computeWatermarkAmount(
  durationId: string,
  promoNormalized: string | null,
): { amount: number; months: number; durationId: WatermarkDurationId } {
  const id = isWatermarkDurationId(durationId) ? durationId : "3m";
  const base = BASE_BY_ID[id];
  const discount =
    promoNormalized === "DEARHOUR2000" ? Math.min(PROMO_DEARHOUR2000_MAX, base) : 0;
  const amount = Math.max(0, base - discount);
  const months = WATERMARK_DURATION_OPTIONS.find((o) => o.id === id)?.months ?? 3;
  return { amount, months, durationId: id };
}
