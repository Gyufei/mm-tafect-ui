import { useContext } from "react";
import useSWR from "swr";

import { UserEndPointContext } from "../providers/user-end-point-provider";
import { NetworkContext } from "../providers/network-provider";
import fetcher from "../fetcher";
import { isAddress } from "../utils";
import { TokenContext } from "../providers/token-provider";

export function useTokenAllowance(
  tokenAddr: string | null,
  swapRouter: string,
  account: string,
) {
  const { gasToken } = useContext(TokenContext);
  const { userPathMap } = useContext(UserEndPointContext);
  const { network } = useContext(NetworkContext);

  const res = useSWR(() => {
    if (!tokenAddr || !account || !swapRouter) return null;
    if (!isAddress(tokenAddr) || !isAddress(account)) return null;
    if (tokenAddr === gasToken?.address) return null;

    const query = new URLSearchParams();
    query.set("chain_id", network?.chain_id || "");
    query.set("token", tokenAddr);
    query.set("account", account);
    query.set("spender", swapRouter || "");

    const queryStr = query.toString();
    console.log(queryStr);

    return `${userPathMap.accountTokenAllowance}?${queryStr}`;
  }, fetcher);

  return {
    ...res,
    data: res?.data?.allowance,
  };
}
