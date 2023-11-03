"use client";

import { createContext } from "react";
import useSWR from "swr";

import { INetwork } from "@/lib/types/network";
import fetcher from "@/lib/fetcher";
import { SystemEndPointPathMap } from "../end-point";
import useIndexStore from "../state";

interface INetworkContext {
  network: INetwork | null;
}

export const NetworkContext = createContext<INetworkContext>({
  network: null,
});

export default function NetworkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const userPathMap = useIndexStore((state) => state.userPathMap());

  const { data: userWeb3Info } = useSWR(
    () => userPathMap.web3Info || null,
    fetcher,
  );
  const { data: networks }: { data: Array<INetwork> } = useSWR(
    SystemEndPointPathMap.networks,
    fetcher,
  );

  const network =
    (networks || []).find(
      (n) => String(n.chain_id) === String(userWeb3Info?.chain_id),
    ) || null;

  return (
    <NetworkContext.Provider
      value={{
        network,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}
