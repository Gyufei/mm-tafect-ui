"use client";

import { createContext, useEffect, useState } from "react";
import useSWR from "swr";

import { INetwork } from "@/lib/types/network";
import { PathMap } from "@/lib/path-map";
import fetcher from "@/lib/fetcher";
import { IToken } from "@/lib/types/token";
import { uniqBy } from "lodash";

interface IWeb3Context {
  network: INetwork | null;
  tokens: Array<IToken>;
  token: IToken | null;
}

export const Web3Context = createContext<IWeb3Context>({
  network: null,
  token: null,
  tokens: [],
});

export default function Web3Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [network, setNetwork] = useState<INetwork | null>(null);
  const [token, setToken] = useState<IToken | null>(null);

  const tokenFetcher = async (url: string) => {
    if (!network?.chain_id) return [];

    const resTokens = await fetcher(url);
    const uniqueT = uniqBy(resTokens || [], "address") as any;
    return uniqueT;
  };

  const { data: web3Info } = useSWR(PathMap.web3Info, fetcher);
  const { data: networks }: { data: Array<INetwork> } = useSWR(
    PathMap.networks,
    fetcher,
  );
  const { data: tokens }: { data: Array<IToken> | undefined } = useSWR(
    `${PathMap.tokenList}?chain_id=${network?.chain_id}`,
    tokenFetcher,
  );

  useEffect(() => {
    if (networks && web3Info?.chain_id) {
      const curNet = networks.find(
        (n) => n.chain_id === String(web3Info?.chain_id),
      );
      setNetwork(curNet || null);
    }
  }, [networks, web3Info]);

  useEffect(() => {
    if (tokens && web3Info?.token_address) {
      const curToken = tokens.find(
        (t) => t.address === web3Info?.token_address,
      );
      setToken(curToken || null);
    }
  }, [tokens, web3Info]);

  return (
    <Web3Context.Provider
      value={{
        network,
        token,
        tokens: tokens || [],
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}
