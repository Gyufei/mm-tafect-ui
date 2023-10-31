import { StateCreator } from "zustand";
import { GlobalStoreSlice } from "./global";

export interface SwapStoreSlice {
  fromAddress: string;
  toAddress: string;
  setFromAddress: (addr: string) => void;
  setToAddress: (addr: string) => void;
}

export const CreateSwapState: StateCreator<
  GlobalStoreSlice & SwapStoreSlice,
  [],
  [],
  SwapStoreSlice
> = (set: any) => ({
  fromAddress: "",
  toAddress: "",
  setFromAddress: (addr: string) => set(() => ({ fromAddress: addr })),
  setToAddress: (addr: string) => set(() => ({ toAddress: addr })),
});
