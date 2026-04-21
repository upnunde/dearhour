import { create } from "zustand";
import { INITIAL_CARD_DATA } from "@/features/invitation-builder/model/defaults";
import {
  ensureContactBlock,
  type CardData,
  type EventInfo,
  type StyleConfig,
} from "@/features/invitation-builder/model/types";

export type {
  AccountItem,
  CardData,
  EventInfo,
  IntroProfile,
  MusicConfig,
  Parent,
  Profile,
  StyleConfig,
} from "@/features/invitation-builder/model/types";
export { ensureContactBlock } from "@/features/invitation-builder/model/types";

// --- 3. 스토어 인터페이스 ---
interface CardStore {
  data: CardData;
  // 기존 하위 호환 및 1뎁스 업데이트용
  updateStyle: (style: Partial<StyleConfig>) => void;
  updateTheme: (theme: Partial<CardData['theme']>) => void;
  updateEventInfo: (info: Partial<EventInfo>) => void;
  updateGreeting: (greeting: Partial<{ title: string; content: string }>) => void;
  updateLocation: (location: Partial<CardData['location']>) => void;
  // ★ 깊은 뎁스(부모님 정보, 계좌 등) 업데이트를 위한 만능 함수
  updateData: (path: string, value: unknown) => void;
  setData: (nextData: CardData) => void;
}

// --- 4. 상태 관리 로직 ---
export const useCardStore = create<CardStore>((set) => ({
  data: INITIAL_CARD_DATA,

  updateStyle: (newStyle) => set((state) => ({ data: { ...state.data, style: { ...state.data.style, ...newStyle } } })),
  updateTheme: (newTheme) => set((state) => ({ data: { ...state.data, theme: { ...state.data.theme, ...newTheme } } })),
  updateEventInfo: (newInfo) => set((state) => ({ data: { ...state.data, eventInfo: { ...state.data.eventInfo, ...newInfo } } })),
  updateGreeting: (newGreeting) => set((state) => ({ data: { ...state.data, greeting: { ...state.data.greeting, ...newGreeting } } })),
  updateLocation: (newLocation) => set((state) => ({ data: { ...state.data, location: { ...state.data.location, ...newLocation } } })),
  setData: (nextData) => set(() => ({ data: ensureContactBlock(nextData) })),

  updateData: (path, value) => set((state) => {
    const keys = path.split(".");
    const newData = { ...state.data } as Record<string, unknown>;
    let current: Record<string, unknown> = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      const next = current[key];
      current[key] =
        next && typeof next === "object"
          ? { ...(next as Record<string, unknown>) }
          : {};
      current = current[key] as Record<string, unknown>;
    }
    current[keys[keys.length - 1]] = value;

    return { data: newData as unknown as CardData };
  }),
}));