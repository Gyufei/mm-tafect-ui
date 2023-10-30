import { StateCreator, create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GlobalStoreSlice {
  timezone: string | null | undefined;
  timezoneText: () => string;
  tzList: { text: string; value: number }[];
  setTimezone: (val: string) => void;
}

interface SwapStoreSlice {
  fromAddress: string;
  toAddress: string;
  setFromAddress: (addr: string) => void;
  setToAddress: (addr: string) => void;
}

const CreateGlobalStoreState: StateCreator<
  GlobalStoreSlice,
  [],
  [["zustand/persist", unknown]]
> = persist(
  (set, get) => ({
    timezone: String(Math.round((new Date().getTimezoneOffset() * -1) / 60)),
    timezoneText: () => {
      console.log(set);
      const timezone = (get() as any).timezone;
      if (!timezone) return "";
      const temp = timezone >= 0 ? `+${timezone}` : timezone;
      return `UTC${temp}`;
    },
    tzList: (() => {
      const arr = [];
      for (let i = 13; i >= -12; i--) {
        const temp = i >= 0 ? `+${i}` : `-${-1 * i}`;
        arr.push({
          text: `UTC${temp}`,
          value: i,
        });
      }
      return arr;
    })(),
    setTimezone: (val: string) => set(() => ({ timezone: val })),
  }),
  {
    name: "globalStorage", // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
  },
);

const CreateSwapAddrState: StateCreator<
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

const useIndexStore = create<GlobalStoreSlice & SwapStoreSlice>((...a) => ({
  ...CreateSwapAddrState(...a),
  ...CreateGlobalStoreState(...a),
}));

export default useIndexStore;
