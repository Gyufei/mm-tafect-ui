import { create } from "zustand";
import { CreateGlobalStoreState, GlobalStoreSlice } from "./global";
import { CreateSwapState, SwapStoreSlice } from "./swap";
import { CreateDashboardState, DashboardStoreSlice } from "./dashboard";

const useIndexStore = create<
  GlobalStoreSlice & SwapStoreSlice & DashboardStoreSlice
>((...a) => ({
  ...CreateSwapState(...a),
  ...CreateDashboardState(...a),
  ...CreateGlobalStoreState(...a),
}));

export default useIndexStore;
