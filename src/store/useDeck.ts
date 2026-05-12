import { create } from "zustand";

export type Direction = "forward" | "back" | "none";

interface DeckState {
  index: number;
  buildStep: number;
  direction: Direction;
  total: number;
  blackout: boolean;
  overview: boolean;
  shortcuts: boolean;
  zoomed: boolean;

  setTotal: (total: number) => void;
  goto: (index: number, buildStep?: number, direction?: Direction) => void;
  next: (builds: number) => void;
  prev: () => void;
  first: () => void;
  last: () => void;
  toggleBlackout: () => void;
  toggleOverview: () => void;
  toggleShortcuts: () => void;
  toggleZoom: () => void;
  setZoom: (zoomed: boolean) => void;
}

export const useDeck = create<DeckState>((set, get) => ({
  index: 0,
  buildStep: 0,
  direction: "none",
  total: 0,
  blackout: false,
  overview: false,
  shortcuts: false,
  zoomed: false,

  setTotal: (total) => set({ total }),

  goto: (index, buildStep = 0, direction = "none") => {
    const { total, index: prev } = get();
    const clamped = Math.max(0, Math.min(total - 1, index));
    set({
      index: clamped,
      buildStep,
      direction: direction === "none" ? (clamped > prev ? "forward" : "back") : direction,
      zoomed: false, // auto-exit zoom on slide change
    });
  },

  next: (builds) => {
    const { index, buildStep, total } = get();
    if (buildStep < builds) {
      set({ buildStep: buildStep + 1, direction: "forward" });
      return;
    }
    if (index < total - 1) {
      set({ index: index + 1, buildStep: 0, direction: "forward", zoomed: false });
    }
  },

  prev: () => {
    const { index, buildStep } = get();
    if (buildStep > 0) {
      set({ buildStep: buildStep - 1, direction: "back" });
      return;
    }
    if (index > 0) {
      set({ index: index - 1, buildStep: 0, direction: "back", zoomed: false });
    }
  },

  first: () => set({ index: 0, buildStep: 0, direction: "back", zoomed: false }),
  last: () => set((state) => ({ index: state.total - 1, buildStep: 0, direction: "forward", zoomed: false })),

  toggleBlackout: () => set((state) => ({ blackout: !state.blackout })),
  toggleOverview: () => set((state) => ({ overview: !state.overview })),
  toggleShortcuts: () => set((state) => ({ shortcuts: !state.shortcuts })),
  toggleZoom: () => set((state) => ({ zoomed: !state.zoomed })),
  setZoom: (zoomed) => set({ zoomed }),
}));
