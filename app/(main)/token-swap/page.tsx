"use client";
import { useState } from "react";

import "./index.css";

import DetailItem from "@/components/shared/detail-item";
import NetworkSelect from "@/components/shared/network-select/network-select";

import { IKeyStoreAccount } from "@/lib/hooks/use-key-store-accounts";

import FilterAccountList from "@/components/token-swap/filter-account-list";
import KeyStoreSelect from "@/components/token-swap/key-store-select";
import { INetwork } from "@/lib/types/network";
import { IToken } from "@/lib/types/token";
import Op from "@/components/token-swap/op";
import SwapHistory from "@/components/token-swap/swap-history";

export default function TokenSwap() {
  const [currentNetwork, setCurrentNetwork] = useState<INetwork | null>(null);
  const [selectedKeyStores, setSelectedKeyStore] = useState<
    Array<IKeyStoreAccount>
  >([]);
  const [selectedToken, setSelectedToken] = useState<IToken | null>(null);

  return (
    <>
      <div className="h-full border-r border-r-[#dadada]">
        <div className="flex flex-col p-4">
          <DetailItem title="Network">
            <NetworkSelect
              value={currentNetwork || null}
              onSelect={(net: INetwork | null) => setCurrentNetwork(net)}
            />
          </DetailItem>
          <DetailItem title="KeyStore">
            <KeyStoreSelect
              networkId={currentNetwork?.chain_id || null}
              keyStores={selectedKeyStores}
              handleKeystoreSelect={(e) => setSelectedKeyStore(e)}
            />
          </DetailItem>
        </div>

        <FilterAccountList
          token={selectedToken}
          handleTokenSelect={(e) => setSelectedToken(e)}
          networkId={currentNetwork?.chain_id || null}
          keyStores={selectedKeyStores}
        ></FilterAccountList>
      </div>

      <div className="flex h-full flex-col justify-between border-r border-r-[#dadada]">
        <Op
          token={selectedToken}
          network={currentNetwork}
          keyStores={selectedKeyStores}
        />
      </div>

      <div className="flex flex-col">
        <SwapHistory networkId={currentNetwork?.chain_id || null} />
      </div>
    </>
  );
}
