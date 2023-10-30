import useSWR from "swr";
import { useContext } from "react";

import fetcher from "../fetcher";
import { NetworkContext } from "../providers/network-provider";
import { UserEndPointContext } from "../providers/user-end-point-provider";
import { isAddress } from "../utils";

export function useNonce(queryAccount: string) {
  const { network } = useContext(NetworkContext);
  const { userPathMap } = useContext(UserEndPointContext);

  const chain_id = network?.chain_id || "";

  const res = useSWR(
    () => {
      if (chain_id && queryAccount && isAddress(queryAccount)) {
        return `${userPathMap.nonceNum}?chain_id=${chain_id}&account=${queryAccount}`;
      } else {
        return null;
      }
    },
    fetcher,
    {
      refreshInterval: 12000,
    },
  );

  return {
    ...res,
    data: res.data?.nonce,
  };
}
