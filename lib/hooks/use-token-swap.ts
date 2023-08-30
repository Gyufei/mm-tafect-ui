import { useContext } from "react";
import useSWRMutation from "swr/mutation";

import fetcher from "@/lib/fetcher";
import { UserEndPointContext } from "@/lib/providers/user-end-point-provider";
import { NetworkContext } from "@/lib/providers/network-provider";
import { IToken } from "../types/token";
import { ITokenNumDesc } from "@/components/token-swap/token-select-and-input";
import { useTokenAllowance } from "./use-token-allowance";

export function useTokenSwap(
  account: string,
  swapRouter: string,
  token0: ITokenNumDesc,
  token1: ITokenNumDesc,
  setToken0: (_t: any) => void,
  setToken1: (_t: any) => void,
) {
  const { userPathMap } = useContext(UserEndPointContext);
  const { network } = useContext(NetworkContext);

  const estimateAction = async (
    t0Addr: string,
    t1Addr: string,
    amount: string,
    exactInput: boolean,
  ) => {
    const targetToken = exactInput ? token1 : token0;
    const setTokenAction = exactInput ? setToken1 : setToken0;

    try {
      const result = await triggerEstimate({
        token0Addr: t0Addr,
        token1Addr: t1Addr,
        amount,
        exactInput: true,
      });
      setTokenAction({ ...targetToken, num: String(result || "") });
    } catch (e) {
      setTokenAction({ ...targetToken, num: "" });
    }
  };

  const fetchEstimate = async (
    url: string,
    {
      arg,
    }: {
      arg: {
        token0Addr: string | undefined;
        token1Addr: string | undefined;
        amount: string | undefined;
        exactInput: boolean;
      };
    },
  ) => {
    if (!swapRouter) return null;

    const { token0Addr, token1Addr, amount, exactInput } = arg;
    if (!token0Addr || !token1Addr || !amount) return null;

    const query = new URLSearchParams();
    query.set("chain_id", network?.chain_id || "");
    query.set("token_in", token0Addr || "");
    query.set("token_out", token1Addr || "");
    query.set("token_amount", String(amount) || "");
    query.set("is_exact_input", exactInput ? "true" : "false");
    query.set("swap_router_address", swapRouter || "");

    const queryStr = query.toString();
    const res = await fetcher(`${url}?${queryStr}`);

    return res?.amount;
  };

  const { trigger: triggerEstimate } = useSWRMutation(
    `${userPathMap.estimateToken}`,
    fetchEstimate,
  );

  const { triggerAllowance } = useTokenAllowance(swapRouter, account);

  const handleToken0Change = async (t: IToken | null) => {
    const allowance = await triggerAllowance({
      tokenAddr: t?.address,
    });
    setToken0({ ...token0, token: t, allowance });

    if (!t) return;
    if (!token0.num && !token1.num) return;

    if (!token1.token) {
      setToken1({ ...token1, num: "" });
      return;
    }

    const isSameToken = t?.address === token1.token?.address;

    if (token0.num) {
      if (isSameToken) {
        setToken1({ ...token1, num: token0.num });
      } else {
        estimateAction(t.address, token1.token.address, token0.num, true);
      }

      return;
    }

    if (token1.num) {
      if (isSameToken) {
        setToken0((val: ITokenNumDesc) => ({ ...val, num: token1.num }));
      } else {
        estimateAction(
          t.address,
          token1.token?.address || "",
          token1.num,
          false,
        );
      }

      return;
    }
  };

  const handleToken0NumChange = (n: string) => {
    if (n === token0.num) return;

    setToken0({ ...token0, num: n });

    if (!token0.token || !token1.token) {
      setToken1({ ...token1, num: "" });
      return;
    }

    if (token0.token && token1.token) {
      const isSameToken = token0?.token?.address === token1.token?.address;

      if (isSameToken) {
        setToken1({ ...token1, num: n });
      } else {
        estimateAction(
          token0?.token?.address || "",
          token1?.token?.address || "",
          n,
          true,
        );
      }

      return;
    }
  };

  const handleToken1Change = async (t: IToken | null) => {
    const allowance = await triggerAllowance({
      tokenAddr: t?.address,
    });

    setToken1({ ...token1, token: t, allowance });

    if (!t) return;
    if (!token0.num && !token1.num) return;

    if (!token0.token) {
      setToken0({ ...token0, num: "" });
      return;
    }

    const isSameToken = t?.address === token0.token?.address;

    if (token1.num) {
      if (isSameToken) {
        setToken0({ ...token1, num: token0.num });
      } else {
        estimateAction(
          token0?.token?.address || "",
          t?.address || "",
          token1.num,
          false,
        );
      }

      return;
    }

    if (token0.num) {
      if (isSameToken) {
        setToken1((val: ITokenNumDesc) => ({ ...val, num: token0.num }));
      } else {
        estimateAction(
          token0.token?.address || "",
          t?.address,
          token0.num,
          true,
        );
      }

      return;
    }
  };

  const handleToken1NumChange = (n: string) => {
    if (n === token1.num) return;

    setToken1({ ...token1, num: n });

    if (!token0.token || !token1.token) {
      setToken0({ ...token1, num: "" });
      return;
    }

    if (token0.token && token1.token) {
      const isSameToken = token0?.token?.address === token1.token?.address;

      if (isSameToken) {
        setToken0({ ...token0, num: n });
      } else {
        estimateAction(
          token0.token?.address || "",
          token1?.token?.address || "",
          n,
          false,
        );
      }

      return;
    }
  };

  return {
    handleToken0Change,
    handleToken0NumChange,
    handleToken1Change,
    handleToken1NumChange,
  };
}
