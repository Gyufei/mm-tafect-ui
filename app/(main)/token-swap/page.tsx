"use client";
import { useContext, useState } from "react";

import "./index.css";

import DetailItem from "@/components/shared/detail-item";

import { IKeyStoreAccount } from "@/lib/hooks/use-key-store-accounts";

import FilterAccountList from "@/components/token-swap/filter-account-list";
import KeyStoreSelect from "@/components/token-swap/key-store-select";
import { IToken } from "@/lib/types/token";
import Op from "@/components/token-swap/op";
import SwapHistory from "@/components/token-swap/swap-history";
import { Web3Context } from "@/lib/providers/web3-provider";

export default function TokenSwap() {
  const { network } = useContext(Web3Context);

  const [tokenOptions, setTokenOptions] = useState<Array<IToken>>([]);
  const [selectedKeyStores, setSelectedKeyStore] = useState<
    Array<IKeyStoreAccount>
  >([]);

  return (
    <>
      <div className="h-full border-r border-r-[#dadada]">
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
        />
      </div>

      <div className="flex flex-col">
        <SwapHistory />
      </div>
    </>
  );
}
