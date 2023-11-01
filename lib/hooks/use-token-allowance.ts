import { useContext, useMemo } from "react";
import useSWR from "swr";

import { NetworkContext } from "../providers/network-provider";
import fetcher from "../fetcher";
import { isAddress } from "../utils";
import { TokenContext } from "../providers/token-provider";
import useIndexStore from "../state";

export function useTokenAllowance(
  tokenAddr: string | null,
  swapRouter: string,
  account: string,
) {
  const userPathMap = useIndexStore((state) => state.userPathMap());

  const { gasToken } = useContext(TokenContext);
  const { network } = useContext(NetworkContext);

  const queryStr = useMemo(() => {
    if (!tokenAddr || !account || !swapRouter) return null;
    if (!isAddress(tokenAddr) || !isAddress(account)) return null;
    if (tokenAddr === gasToken?.address) return null;

    const query = new URLSearchParams();
    query.set("chain_id", network?.chain_id || "");
    query.set("token", tokenAddr);
    query.set("account", account);
    query.set("spender", swapRouter || "");

    const queryStr = query.toString();

    return queryStr;
  }, [tokenAddr, account, swapRouter, network?.chain_id, gasToken?.address]);

  const res = useSWR(() => {
    if (!queryStr) return null;
    return `${userPathMap.accountTokenAllowance}?${queryStr}`;
  }, fetcher);

  return {
    ...res,
    data: res?.data?.allowance,
  };
}
