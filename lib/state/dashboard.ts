import { StateCreator } from "zustand";
import { GlobalStoreSlice } from "./global";
import { SwapStoreSlice } from "./swap";
import { startOfToday } from "date-fns";
import { IUpDownValue } from "../constants/dashboard-const";
import { UpDownLabelOptions } from "../constants/dashboard-const";

export interface DashboardStoreSlice {
  selectedDay: Date;
  upOrDown: IUpDownValue;
  topRandom: boolean;
  topValueMin: string;
  topValueMax: string;
  topValueAcc: string;

  bottomRandom: boolean;
  bottomValueMin: string;
  bottomValueMax: string;
  bottomValueAcc: string;

  rangeValueRandom: boolean;
  rangeValueMin: string;
  rangeValueMax: string;
  rangeValueAcc: string;

  totalTradingRandom: boolean;
  totalTradingVolumeAcc: string;
  totalTradingVolumeMax: string;
  totalTradingVolumeMin: string;

  tradingTxRandom: boolean;
  tradingTxAcc: string;
  tradingTxMax: string;
  tradingTxMin: string;

  isAvgGas: boolean;
  gasValue: string;
  minTxSpanValue: string;
  minTxSpanUnit: string;

  setUpOrDown: (val: IUpDownValue) => void;
  setSelectedDay: (day: Date) => void;

  setTopRandom: (val: boolean) => void;
  setTopValueMin: (val: string) => void;
  setTopValueMax: (val: string) => void;
  setTopValueAcc: (val: string) => void;

  setBottomRandom: (val: boolean) => void;
  setBottomValueMin: (val: string) => void;
  setBottomValueMax: (val: string) => void;
  setBottomValueAcc: (val: string) => void;

  setRangeValueRandom: (val: boolean) => void;
  setRangeValueMin: (val: string) => void;
  setRangeValueMax: (val: string) => void;
  setRangeValueAcc: (val: string) => void;

  setTotalTradingRandom: (val: boolean) => void;
  setTotalTradingVolumeAcc: (val: string) => void;
  setTotalTradingVolumeMax: (val: string) => void;
  setTotalTradingVolumeMin: (val: string) => void;

  setTradingTxRandom: (val: boolean) => void;
  setTradingTxAcc: (val: string) => void;
  setTradingTxMax: (val: string) => void;
  setTradingTxMin: (val: string) => void;

  setIsAvgGas: (val: boolean) => void;
  setGasValue: (val: string) => void;
  setMinTxSpanValue: (val: string) => void;
  setMinTxSpanUnit: (val: string) => void;
}

export const CreateDashboardState: StateCreator<
  GlobalStoreSlice & SwapStoreSlice & DashboardStoreSlice,
  [],
  [],
  DashboardStoreSlice
> = (set: any) => ({
  selectedDay: startOfToday(),
  setSelectedDay: (day: Date) => set(() => ({ selectedDay: day })),

  upOrDown: UpDownLabelOptions[0],
  setUpOrDown: (val: IUpDownValue) => set(() => ({ upOrDown: val })),

  topRandom: true,
  topValueMin: "",
  topValueMax: "",
  topValueAcc: "",
  setTopRandom: (val: boolean) => set(() => ({ topRandom: val })),
  setTopValueMin: (val: string) => set(() => ({ topValueMin: val })),
  setTopValueMax: (val: string) => set(() => ({ topValueMax: val })),
  setTopValueAcc: (val: string) => set(() => ({ topValueAcc: val })),

  bottomRandom: true,
  bottomValueMin: "",
  bottomValueMax: "",
  bottomValueAcc: "",
  setBottomRandom: (val: boolean) => set(() => ({ bottomRandom: val })),
  setBottomValueMin: (val: string) => set(() => ({ bottomValueMin: val })),
  setBottomValueMax: (val: string) => set(() => ({ bottomValueMax: val })),
  setBottomValueAcc: (val: string) => set(() => ({ bottomValueAcc: val })),

  rangeValueRandom: true,
  rangeValueMin: "",
  rangeValueMax: "",
  rangeValueAcc: "",
  setRangeValueRandom: (val: boolean) => set(() => ({ rangeValueRandom: val })),
  setRangeValueMin: (val: string) => set(() => ({ rangeValueMin: val })),
  setRangeValueMax: (val: string) => set(() => ({ rangeValueMax: val })),
  setRangeValueAcc: (val: string) => set(() => ({ rangeValueAcc: val })),

  totalTradingRandom: true,
  totalTradingVolumeAcc: "",
  totalTradingVolumeMax: "",
  totalTradingVolumeMin: "",
  setTotalTradingRandom: (val: boolean) =>
    set(() => ({ totalTradingRandom: val })),
  setTotalTradingVolumeAcc: (val: string) =>
    set(() => ({ totalTradingVolumeAcc: val })),
  setTotalTradingVolumeMax: (val: string) =>
    set(() => ({ totalTradingVolumeMax: val })),
  setTotalTradingVolumeMin: (val: string) =>
    set(() => ({ totalTradingVolumeMin: val })),

  tradingTxRandom: true,
  tradingTxAcc: "",
  tradingTxMax: "",
  tradingTxMin: "",
  setTradingTxAcc: (val: string) => set(() => ({ tradingTxAcc: val })),
  setTradingTxRandom: (val: boolean) => set(() => ({ tradingTxRandom: val })),
  setTradingTxMin: (val: string) => set(() => ({ tradingTxMin: val })),
  setTradingTxMax: (val: string) => set(() => ({ tradingTxMax: val })),

  isAvgGas: false,
  setIsAvgGas: (val: boolean) => set(() => ({ isAvgGas: val })),
  gasValue: "",
  setGasValue: (val: string) => set(() => ({ gasValue: val })),

  minTxSpanValue: "",
  setMinTxSpanValue: (val: string) => set(() => ({ minTxSpanValue: val })),

  minTxSpanUnit: "",
  setMinTxSpanUnit: (val: string) => set(() => ({ minTxSpanUnit: val })),
});
