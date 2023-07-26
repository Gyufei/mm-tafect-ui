import { useEffect, useMemo, useState } from "react";
import { PathMap } from "../path";
import useSWR from "swr";
import { useFetcher } from "./use-fetcher";

export interface IAccountGas {
  account: string;
  gas: string;
}

export function useAccountGas(keyStoreItemName: string, network: number) {
  const fetcher = useFetcher();

  const [accountsGas, setAccountsGas] = useState<Array<IAccountGas>>([]);

  const { data: keyStoreAccountResData } = useSWR(
    `${PathMap.keyStoreAccounts}?keystore=${keyStoreItemName}`,
    fetcher,
  );

  const accounts = useMemo(
    () => keyStoreAccountResData?.[0].accounts || [],
    [keyStoreAccountResData],
  );

  const count = useMemo(
    () => keyStoreAccountResData?.[0].count || 0,
    [keyStoreAccountResData],
  );

  useEffect(() => {
    if (!accounts.length) {
      return;
    }

    async function getItemGas() {
      const acGas = await Promise.all(
        accounts.map(async (acc: string) => {
          const res = await fetcher(
            `${PathMap.accountGas}?chain_id=${network}&account=${acc}`,
          );
          const gas = res?.balance_of || 0;
          return { account: acc, gas };
        }),
      );

      setAccountsGas(acGas);
    }

    getItemGas();
  }, [accounts, network]);

  return {
    accounts: accountsGas,
    count,
  };
}
