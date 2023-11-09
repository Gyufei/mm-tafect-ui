import { StateCreator } from "zustand";
import { GlobalStoreSlice } from "./global";
import { SwapStoreSlice } from "./swap";
import { startOfToday } from "date-fns";
import {
  IRangeValueType,
  IUpDownValue,
  RangeValueTypes,
} from "../constants/dashboard-const";
import { UpDownLabelOptions } from "../constants/dashboard-const";

export interface DashboardStoreSlice {
  selectedDay: Date;
  upOrDown: IUpDownValue;
  topRandom: boolean;
  topValueMin: string;
  topValueMax: string;
  bottomRandom: boolean;
  bottomValueMin: string;
  bottomValueMax: string;
  rangeValueMin: string;
  rangeValueMax: string;
  rangeValueType: IRangeValueType;
  totalTradingVolume: string;
  tradingTx: string;
  setUpOrDown: (val: IUpDownValue) => void;
  setSelectedDay: (day: Date) => void;
  setTopRandom: (val: boolean) => void;
  setTopValueMin: (val: string) => void;
  setTopValueMax: (val: string) => void;
  setBottomRandom: (val: boolean) => void;
  setBottomValueMin: (val: string) => void;
  setBottomValueMax: (val: string) => void;
  setRangeValueMin: (val: string) => void;
  setRangeValueMax: (val: string) => void;
  setRangeValueType: (val: (typeof RangeValueTypes)[number]) => void;
  setTotalTradingVolume: (val: string) => void;
  setTradingTx: (val: string) => void;
  useOnlineGas: boolean;
  setUseOnlineGas: (val: boolean) => void;
  gasValue: string;
  setGasValue: (val: string) => void;
  minTxSpanValue: string;
  setMinTxSpanValue: (val: string) => void;
  minTxSpanUnit: string;
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
  rangeValueMin: "",
  setRangeValueMin: (val: string) => set(() => ({ rangeValueMin: val })),
  rangeValueMax: "",
  setRangeValueMax: (val: string) => set(() => ({ rangeValueMax: val })),
  rangeValueType: RangeValueTypes[0],
  setRangeValueType: (val: IRangeValueType) =>
    set(() => ({ rangeValueType: val })),
  totalTradingVolume: "",
  setTotalTradingVolume: (val: string) =>
    set(() => ({ totalTradingVolume: val })),
  tradingTx: "",
  setTradingTx: (val: string) => set(() => ({ tradingTx: val })),

  useOnlineGas: false,
  setUseOnlineGas: (val: boolean) => set(() => ({ useOnlineGas: val })),
  gasValue: "",
  setGasValue: (val: string) => set(() => ({ gasValue: val })),

  minTxSpanValue: "",
  setMinTxSpanValue: (val: string) => set(() => ({ minTxSpan: val })),

  minTxSpanUnit: "",
  setMinTxSpanUnit: (val: string) => set(() => ({ minTxSpanUnit: val })),
});
