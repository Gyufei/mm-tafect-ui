import { useContext, useEffect, useState } from "react";
import useSWR from "swr";

import { UserEndPointContext } from "../providers/user-end-point-provider";
import fetcher from "../fetcher";
import { IAdvanceOptions } from "@/components/token-swap/op-advance-options";
import { isAddress } from "../utils";

export function useAdvanceOptions(networkId: string, queryAccount: string) {
  const { userPathMap } = useContext(UserEndPointContext);

  const { data: gasPrice } = useSWR(() => {
    if (networkId) {
      return `${userPathMap.gasPrice}?chain_id=${networkId}`;
    } else {
      return null;
    }
  }, fetcher);

  const { data: nonceData } = useSWR(() => {
    if (networkId && queryAccount && isAddress(queryAccount)) {
      return `${userPathMap.nonceNum}?chain_id=${networkId}&account=${queryAccount}`;
    } else {
      return null;
    }
  }, fetcher);

  useEffect(() => {
    if (nonceData) {
      setAdvanceOptions({ ...advanceOptions, nonce: Number(nonceData.nonce) });
    }
  }, [nonceData]);

  useEffect(() => {
    if (gasPrice) {
      setAdvanceOptions({
        ...advanceOptions,
        gas: Number(gasPrice.gas_price) / 10 ** 9,
      });
    }
  }, [gasPrice]);

  const [advanceOptions, setAdvanceOptions] = useState<IAdvanceOptions>({
    schedule: null,
    timeout: 1800,
    slippage: "0.02",
    nonce: null,
    gas: null,
    fixed_gas: false,
    no_check_gas: false,
  });

  return {
    advanceOptions,
    setAdvanceOptions,
  };
}
