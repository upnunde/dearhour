/** 에디터 메인「기본 이미지」모드 전용 — 웨딩 분위기 예시(꽃 SVG 에셋 미사용) */
export const MAIN_IMAGE_PRESETS = [
  {
    id: "main-01",
    label: "메인 1",
    url: "/images/main-presets/main_01.png",
  },
  {
    id: "main-02",
    label: "메인 2",
    url: "/images/main-presets/main_02.png",
  },
  {
    id: "main-03",
    label: "메인 3",
    url: "/images/main-presets/main_03.png",
  },
  {
    id: "main-04",
    label: "메인 4",
    url: "/images/main-presets/main_04.png",
  },
  {
    id: "main-05",
    label: "메인 5",
    url: "/images/main-presets/main_05.png",
  },
  {
    id: "main-06",
    label: "메인 6",
    url: "/images/main-presets/main_06.png",
  },
  {
    id: "main-07",
    label: "메인 7",
    url: "/images/main-presets/main_07.png",
  },
  {
    id: "main-08",
    label: "메인 8",
    url: "/images/main-presets/main_08.png",
  },
] as const;

export const DEFAULT_MAIN_PRESET_URL =
  MAIN_IMAGE_PRESETS.find((preset) => preset.id === "main-01")?.url ?? MAIN_IMAGE_PRESETS[0].url;
