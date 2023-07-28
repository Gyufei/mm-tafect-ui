import useSWR from "swr";
import { useEffect, useState } from "react";

import fetcher from "@/lib/fetcher";
import { PathMap } from "@/lib/path-map";

export interface KeyStoreAccount {
  name: string;
  accounts: Array<string>;
  count: number;
}

export function useKeyStoreAccounts(network: string) {
  const { data: keyStores } = useSWR(PathMap.userKeyStores, fetcher);

  const [keyStoreAccounts, setKeyStoreAccounts] = useState<
    Array<KeyStoreAccount>
  >([]);

  useEffect(() => {
    if (!keyStores?.length || !network) {
      return;
    }

    async function getItemAccounts() {
      const ksAcs = await Promise.all(
        keyStores.map(async (name: string) => {
          const res = await fetcher(
            `${PathMap.keyStoreAccounts}?keystore=${name}&chain_id=${network}`,
          );
          const accounts = (res?.[0]?.accounts as Array<string>) || [];
          const count = res?.[0]?.count;
          return { name, accounts, count };
        }),
      );

      setKeyStoreAccounts(ksAcs);
    }

    getItemAccounts();
  }, [keyStores, network]);

  return keyStoreAccounts;
}
