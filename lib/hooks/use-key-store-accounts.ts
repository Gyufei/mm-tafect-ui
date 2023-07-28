import useSWR from "swr";
import { useEffect, useState } from "react";

import fetcher from "@/lib/fetcher";
import { PathMap } from "@/lib/path-map";

export interface IKeyStoreAccount {
  name: string;
  accounts: Array<string>;
  count: number;
}

export function useKeyStoreAccounts(networkId: string | null) {
  const { data: keyStores } = useSWR(PathMap.userKeyStores, fetcher);

  const [keyStoreAccounts, setKeyStoreAccounts] = useState<
    Array<IKeyStoreAccount>
  >([]);

  useEffect(() => {
    if (!keyStores?.length || !networkId) {
      return;
    }

    async function getItemAccounts() {
      const ksAcs = await Promise.all(
        keyStores.map(async (name: string) => {
          const res = await fetcher(
            `${PathMap.keyStoreAccounts}?keystore=${name}&chain_id=${networkId}`,
          );
          const accounts = (res?.[0]?.accounts as Array<string>) || [];
          const count = res?.[0]?.count;
          return { name, accounts, count };
        }),
      );

      setKeyStoreAccounts(ksAcs);
    }

    getItemAccounts();
  }, [keyStores, networkId]);

  return keyStoreAccounts;
}
