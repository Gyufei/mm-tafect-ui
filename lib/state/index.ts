import { create } from "zustand";
import { CreateGlobalStoreState, GlobalStoreSlice } from "./global";
import { CreateSwapState, SwapStoreSlice } from "./swap";

const useIndexStore = create<GlobalStoreSlice & SwapStoreSlice>((...a) => ({
  ...CreateSwapState(...a),
  ...CreateGlobalStoreState(...a),
}));

export default useIndexStore;
