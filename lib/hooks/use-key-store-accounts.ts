import { useEffect, useMemo, useState } from "react";
import { PathMap } from "../path";
import { useFetcher } from "./use-fetcher";
import useSWR from "swr";

export interface KeyStoreAccount {
  name: string;
  accounts: Array<string>;
  count: number;
}

export function useKeyStoreAccounts() {
  const fetcher = useFetcher();
  const { data: keyStoreData } = useSWR(PathMap.keyStores, fetcher);

  const keyStores = useMemo<Array<string>>(
    () => keyStoreData?.keystore_name_list || [],
    [keyStoreData],
  );

  const [keyStoreAccounts, setKeyStoreAccounts] = useState<
    Array<KeyStoreAccount>
  >([]);

  useEffect(() => {
    if (!keyStores.length) {
      return;
    }

    async function getItemAccounts() {
      const ksAcs = await Promise.all(
        keyStores.map(async (keyStore) => {
          const res = await fetcher(
            `${PathMap.keyStoreAccounts}?keystore=${keyStore}`,
          );
          const accounts = (res?.[0]?.accounts as Array<string>) || [];
          const count = res?.[0]?.count;
          return { name: keyStore, accounts, count };
        }),
      );

      setKeyStoreAccounts(ksAcs);
    }

    getItemAccounts();
  }, [keyStores]);

  return keyStoreAccounts;
}
