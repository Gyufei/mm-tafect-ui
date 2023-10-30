import { useContext } from "react";
import { NetworkContext } from "../providers/network-provider";
import { UserEndPointContext } from "../providers/user-end-point-provider";
import { IToken } from "../types/token";
import useSWRMutation from "swr/mutation";
import fetcher from "../fetcher";

export function useAccountBalance(
  fromAddress: string,
  userToken: IToken | null,
  stableToken: IToken | null,
) {
  const { userPathMap } = useContext(UserEndPointContext);
  const { network } = useContext(NetworkContext);

  const getAccountBalanceQuery = () => {
    const queryParams = new URLSearchParams();

    if (!network || !fromAddress) {
      return;
    }

    queryParams.set("chain_id", network?.chain_id.toString());
    queryParams.set("account", fromAddress);

    const queryTokens = [userToken?.address, stableToken?.address];
    queryParams.set("tokens", queryTokens.join(","));

    const query = queryParams.toString();

    return query;
  };

  const getGasBalanceQuery = () => {
    const queryParams = new URLSearchParams();

    if (!network || !fromAddress) {
      return;
    }

    queryParams.set("chain_id", network?.chain_id.toString());
    queryParams.set("account", fromAddress);

    const query = queryParams.toString();

    return query;
  };

  const {
    data: accountBalanceRes,
    trigger: triggerAccountBalance,
    reset: resetAccountBalance,
  } = useSWRMutation(
    `${userPathMap.accountTokensBalance}?${getAccountBalanceQuery()}`,
    fetcher as any,
  );

  const {
    data: gasBalanceRes,
    trigger: triggerGasBalance,
    reset: resetGasBalance,
  } = useSWRMutation(
    `${userPathMap.accountTokenBalance}?${getGasBalanceQuery()}`,
    fetcher as any,
  );

  return {
    accountBalanceRes,
    triggerAccountBalance,
    resetAccountBalance,
    gasBalanceRes,
    triggerGasBalance,
    resetGasBalance,
  };
}
