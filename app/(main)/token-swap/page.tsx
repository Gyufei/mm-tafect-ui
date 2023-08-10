"use client";
import { useContext, useState } from "react";
import { useSwipeable } from "react-swipeable";

import DetailItem from "@/components/shared/detail-item";

import { IKeyStoreAccount } from "@/lib/hooks/use-key-store-accounts";

import FilterAccountList from "@/components/token-swap/filter-account-list";
import KeyStoreSelect from "@/components/token-swap/key-store-select";
import { IToken } from "@/lib/types/token";
import Op from "@/components/token-swap/op";
import SwapHistory from "@/components/token-swap/swap-history";
import { Web3Context } from "@/lib/providers/web3-provider";
import MobileFoldBtn from "@/components/token-swap/mobile-fold-btn";

export default function TokenSwap() {
  const { network } = useContext(Web3Context);

  const [tokenOptions, setTokenOptions] = useState<Array<IToken>>([]);
  const [selectedKeyStores, setSelectedKeyStore] = useState<
    Array<IKeyStoreAccount>
  >([]);

  const foldPages = ["Filter Account", "Filter Task"];
  const [showSlidePage, setShowSlidePage] = useState<
    "Filter Account" | "Filter Task" | null
  >(null);

  const swiperHandlers = useSwipeable({
    onSwipedDown: (_e) => {
      setShowSlidePage(null);
    },
  });

  const SwiperHandlerBox = () => {
    return (
      <div className="md:hidden" {...swiperHandlers}>
        <div className="mx-auto mt-3 h-1 w-12 rounded-md bg-shadow-color"></div>
      </div>
    );
  };

  return (
    <>
      <div
        data-state={showSlidePage === "Filter Account"}
        className="absolute top-[-69px] z-10  h-screen w-full rounded-t-3xl border-[#dadada] bg-[#fafafa] data-[state=false]:hidden data-[state=true]:animate-in data-[state=false]:animate-out data-[state=false]:slide-out-to-bottom data-[state=true]:slide-in-from-bottom md:static md:h-full md:w-auto md:rounded-none md:border-r md:data-[state=false]:block"
      >
        <SwiperHandlerBox />
        <div className="flex flex-col p-4">
          <DetailItem title="Network">{network?.network_name}</DetailItem>
          <DetailItem title="KeyStore">
            <KeyStoreSelect
              keyStores={selectedKeyStores}
              handleKeyStoreSelect={(e) => setSelectedKeyStore(e)}
            />
          </DetailItem>
        </div>

        <FilterAccountList
          tokens={tokenOptions}
          keyStores={selectedKeyStores}
        ></FilterAccountList>
      </div>

      <div className="flex h-full flex-col justify-between border-r border-r-[#dadada]">
        <Op
          tokens={tokenOptions}
          keyStores={selectedKeyStores}
          handleTokensChange={setTokenOptions}
        >
          <MobileFoldBtn
            pages={foldPages}
            onChange={(e) =>
              setShowSlidePage(e as "Filter Account" | "Filter Task")
            }
          />
        </Op>
      </div>

      <div
        data-state={showSlidePage === "Filter Task"}
        className="absolute top-[-69px] z-10 h-screen w-full rounded-t-3xl border-[#dadada] bg-[#fafafa] data-[state=false]:hidden md:static md:h-full md:w-auto md:rounded-none md:border-r md:data-[state=false]:block"
      >
        <SwiperHandlerBox />
        <SwapHistory />
      </div>
    </>
  );
}
