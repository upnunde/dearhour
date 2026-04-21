import { create } from "zustand";

type MobilePanel = "editor" | "preview";

interface BuilderUiStore {
  activeSection: string;
  setActiveSection: (value: string) => void;
  editorWidth: number;
  setEditorWidth: (value: number) => void;
  mobilePanel: MobilePanel;
  setMobilePanel: (value: MobilePanel) => void;
  previewVisibleSections: Record<string, boolean>;
  setPreviewVisibleSections: (
    value:
      | Record<string, boolean>
      | ((prev: Record<string, boolean>) => Record<string, boolean>)
  ) => void;
}

export const useBuilderUiStore = create<BuilderUiStore>((set) => ({
  activeSection: "hosts",
  setActiveSection: (value) => set({ activeSection: value }),
  editorWidth: 560,
  setEditorWidth: (value) => set({ editorWidth: value }),
  mobilePanel: "editor",
  setMobilePanel: (value) => set({ mobilePanel: value }),
  previewVisibleSections: {},
  setPreviewVisibleSections: (value) =>
    set((state) => ({
      previewVisibleSections:
        typeof value === "function" ? value(state.previewVisibleSections) : value,
    })),
}));
