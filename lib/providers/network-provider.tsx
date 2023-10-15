"use client";

import { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";

import { INetwork } from "@/lib/types/network";
import fetcher from "@/lib/fetcher";
import { SystemEndPointPathMap } from "../end-point";
import { UserEndPointContext } from "./user-end-point-provider";

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
  const { userPathMap } = useContext(UserEndPointContext);

  const [network, setNetwork] = useState<INetwork | null>(null);
  const { data: userWeb3Info } = useSWR(
    () => userPathMap.web3Info || null,
    fetcher,
  );
  const { data: networks }: { data: Array<INetwork> } = useSWR(
    SystemEndPointPathMap.networks,
    fetcher,
  );

  useEffect(() => {
    if (networks && userWeb3Info?.chain_id) {
      const curNet = networks.find(
        (n) => String(n.chain_id) === String(userWeb3Info?.chain_id),
      );
      setNetwork(curNet || null);
    }
  }, [networks, userWeb3Info]);

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
