import { useContext } from "react";
import useSWRMutation from "swr/mutation";
import { UserEndPointContext } from "../providers/user-end-point-provider";
import { NetworkContext } from "../providers/network-provider";
import fetcher from "../fetcher";

export function useTokenAllowance(swapRouter: string, account: string) {
  const { userPathMap } = useContext(UserEndPointContext);
  const { network } = useContext(NetworkContext);

  const fetchAllowance = async (
    url: string,
    {
      arg,
    }: {
      arg: {
        tokenAddr: string | undefined;
      };
    },
  ) => {
    if (!swapRouter) return null;

    const { tokenAddr } = arg;
    if (!tokenAddr || !account || !swapRouter) return null;

    const query = new URLSearchParams();
    query.set("chain_id", network?.chain_id || "");
    query.set("token", tokenAddr);
    query.set("account", account);
    query.set("spender", swapRouter || "");

    const queryStr = query.toString();
    try {
      const res = await fetcher(`${url}?${queryStr}`);
      return res?.allowance;
    } catch (e) {
      return null;
    }
  };

  const { trigger: triggerAllowance } = useSWRMutation(
    `${userPathMap.accountTokenAllowance}`,
    fetchAllowance,
  );

  return {
    triggerAllowance,
  };
}
