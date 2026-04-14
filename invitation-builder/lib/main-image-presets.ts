/** 에디터 메인「기본 이미지」모드 전용 — 웨딩 분위기 예시(꽃 SVG 에셋 미사용) */
export const MAIN_IMAGE_PRESETS = [
  {
    id: "classic",
    label: "클래식",
    url: "/images/main-presets/main04.png",
  },
  {
    id: "ceremony",
    label: "세레모니",
    url: "/images/main-presets/main06.png",
  },
  {
    id: "wedding-ring",
    label: "웨딩링",
    url: "/images/main-presets/main05.png",
  },
  {
    id: "romantic",
    label: "로맨틱",
    url: "/images/main-presets/main02.png",
  },
  {
    id: "illustration",
    label: "일러스트",
    url: "/images/main-presets/main01.png",
  },
  {
    id: "garden",
    label: "가든",
    url: "/images/main-presets/main07.png",
  },
] as const;

export const DEFAULT_MAIN_PRESET_URL =
  MAIN_IMAGE_PRESETS.find((preset) => preset.id === "classic")?.url ?? MAIN_IMAGE_PRESETS[0].url;
