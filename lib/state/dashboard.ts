import { StateCreator } from "zustand";
import { GlobalStoreSlice } from "./global";
import { SwapStoreSlice } from "./swap";
import { startOfToday } from "date-fns";

export interface DashboardStoreSlice {
  selectedDay: Date;
  setSelectedDay: (day: Date) => void;
}

export const CreateDashboardState: StateCreator<
  GlobalStoreSlice & SwapStoreSlice & DashboardStoreSlice,
  [],
  [],
  DashboardStoreSlice
> = (set: any) => ({
  selectedDay: startOfToday(),
  setSelectedDay: (day: Date) => set(() => ({ selectedDay: day })),
});
