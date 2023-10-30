import { useEffect, useState } from "react";

import { IAdvanceOptions } from "@/components/token-swap/op-advance-options";
import { useGasPrice } from "./use-gas-price";
import { useNonce } from "./use-nonce";

export function useAdvanceOptions(queryAccount: string) {
  const { data: gasPrice } = useGasPrice();
  const { data: nonce } = useNonce(queryAccount);

  useEffect(() => {
    if (nonce) {
      setAdvanceOptions({ ...advanceOptions, nonce: nonce });
    }
  }, [nonce]);

  useEffect(() => {
    if (gasPrice) {
      setAdvanceOptions({
        ...advanceOptions,
        gas: gasPrice,
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
