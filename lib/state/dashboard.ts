import { StateCreator } from "zustand";
import { GlobalStoreSlice } from "./global";
import { SwapStoreSlice } from "./swap";
import { startOfToday } from "date-fns";

export interface DashboardStoreSlice {
  selectedDay: Date;
  upOrDown: string;
  topRandom: boolean;
  topValueMin: string;
  topValueMax: string;
  bottomRandom: boolean;
  bottomValueMin: string;
  bottomValueMax: string;
  middleValueMin: string;
  middleValueMax: string;
  setUpOrDown: (val: string) => void;
  setSelectedDay: (day: Date) => void;
  setTopRandom: (val: boolean) => void;
  setTopValueMin: (val: string) => void;
  setTopValueMax: (val: string) => void;
  setBottomRandom: (val: boolean) => void;
  setBottomValueMin: (val: string) => void;
  setBottomValueMax: (val: string) => void;
  setMiddleValueMin: (val: string) => void;
  setMiddleValueMax: (val: string) => void;
}

export const CreateDashboardState: StateCreator<
  GlobalStoreSlice & SwapStoreSlice & DashboardStoreSlice,
  [],
  [],
  DashboardStoreSlice
> = (set: any) => ({
  selectedDay: startOfToday(),
  setSelectedDay: (day: Date) => set(() => ({ selectedDay: day })),
  upOrDown: "up",
  setUpOrDown: (val: string) => set(() => ({ upOrDown: val })),
  topRandom: true,
  setTopRandom: (val: boolean) => set(() => ({ topRandom: val })),
  topValueMin: "",
  setTopValueMin: (val: string) => set(() => ({ topValueMin: val })),
  topValueMax: "",
  setTopValueMax: (val: string) => set(() => ({ topValueMax: val })),
  bottomRandom: true,
  setBottomRandom: (val: boolean) => set(() => ({ bottomRandom: val })),
  bottomValueMin: "",
  setBottomValueMin: (val: string) => set(() => ({ bottomValueMin: val })),
  bottomValueMax: "",
  setBottomValueMax: (val: string) => set(() => ({ bottomValueMax: val })),
  middleValueMin: "",
  setMiddleValueMin: (val: string) => set(() => ({ middleValueMin: val })),
  middleValueMax: "",
  setMiddleValueMax: (val: string) => set(() => ({ middleValueMax: val })),
});
