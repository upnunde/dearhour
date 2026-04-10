/**
 * 공유 썸네일「이미지 고르기」— 웨딩 초대장에 어울리는 가로형(OG 비율) 예시 이미지
 */
const q = "w=1200&h=630&q=80&auto=format&fit=crop";

export const SHARE_THUMBNAIL_PRESETS = [
  {
    id: "invitation-suite",
    label: "초대장",
    url: `https://images.unsplash.com/photo-1523438885200-e635ba2c371e?${q}`,
  },
  {
    id: "bouquet",
    label: "부케",
    url: `https://images.unsplash.com/photo-1519225421980-715cb0215aed?${q}`,
  },
  {
    id: "rings",
    label: "웨딩링",
    url: `https://images.unsplash.com/photo-1515934751635-c81c6bc5a173?${q}`,
  },
  {
    id: "venue",
    label: "세레모니",
    url: `https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?${q}`,
  },
  {
    id: "romantic",
    label: "로맨틱",
    url: `https://images.unsplash.com/photo-1522673607200-164d1b6ce486?${q}`,
  },
] as const;
