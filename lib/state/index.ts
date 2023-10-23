import { create } from "zustand";

interface SwapAddressState {
  fromAddress: string;
  toAddress: string;
  action: {
    setFromAddress: (_addr: string) => void;
    setToAddress: (_addr: string) => void;
  };
}

const useSwapAddressStore = create<SwapAddressState>((set) => ({
  fromAddress: "",
  toAddress: "",
  action: {
    setFromAddress: (addr) => set(() => ({ fromAddress: addr })),
    setToAddress: (addr) => set(() => ({ toAddress: addr })),
  },
}));

export default useSwapAddressStore;
