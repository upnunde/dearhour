/**
 * When geocode or transit APIs yield no data.
 * Used by `/api/weddinghall-transit` and `applyVenueSuggestion` when no data is returned.
 */
export function getDefaultTransitGuides(): Array<{ mode: string; detail: string }> {
  return [
    {
      mode: "지하철",
      detail: "가까운 지하철역 안내는 예식장 약도(상세 지도) 기준으로 확인해 주세요.",
    },
    {
      mode: "버스",
      detail: "버스 노선 번호는 예식장 약도에 기재된 최신 정보를 확인해 주세요.",
    },
    {
      mode: "주차장",
      detail: "주차 가능 여부 및 할인 조건은 예식장으로 확인해 주세요.",
    },
  ];
}
