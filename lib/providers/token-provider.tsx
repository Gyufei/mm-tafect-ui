"use client";

import { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";

import fetcher from "@/lib/fetcher";
import { IToken } from "@/lib/types/token";
import { NetworkContext } from "./network-provider";
import { uniqBy } from "lodash";
import { UserEndPointContext } from "./user-end-point-provider";

interface ITokenContext {
  tokens: Array<IToken>;
  token: IToken | null;
}

export const TokenContext = createContext<ITokenContext>({
  token: null,
  tokens: [],
});

export default function TokenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userPathMap } = useContext(UserEndPointContext);

  const [token, setToken] = useState<IToken | null>(null);

  const { data: userWeb3Info } = useSWR(
    () => userPathMap.web3Info || null,
    fetcher,
  );

  const { network } = useContext(NetworkContext);
  const networkId = network?.chain_id || null;

  const tokenFetcher = async (url: string): Promise<Array<IToken>> => {
    if (!networkId) return [];

    const resTokens = await fetcher(url);
    const uniqueT = uniqBy(resTokens || [], "address") as any;
    return uniqueT;
  };

  const { data: tokens } = useSWR(
    `${userPathMap.tokenList}?chain_id=${networkId}`,
    tokenFetcher,
  );

  useEffect(() => {
    if (tokens && userWeb3Info?.token_address) {
      const curToken = tokens.find(
        (t) => t.address === userWeb3Info?.token_address,
      );
      setToken(curToken || null);
    }
  }, [tokens, userWeb3Info]);

  return (
    <TokenContext.Provider
      value={{
        token,
        tokens: tokens || [],
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}
