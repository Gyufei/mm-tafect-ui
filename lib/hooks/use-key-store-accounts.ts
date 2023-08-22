import useSWR from "swr";
import { useContext, useEffect, useState } from "react";

import fetcher from "@/lib/fetcher";
import { SystemEndPointPathMap } from "../end-point";
import { UserEndPointContext } from "../providers/user-end-point-provider";

export interface IKeyStoreAccount {
  name: string;
  accounts: Array<IKeyStoreAccountItem>;
  count: number;
}

interface IKeyStoreAccountItem {
  account: string;
  gas: string;
  tx: number;
}

export function useKeyStoreAccounts(networkId: string | null, _page: string) {
  const { userPathMap } = useContext(UserEndPointContext);

  const { data: keyStores } = useSWR(
    SystemEndPointPathMap.userKeyStores,
    // `${SystemEndPointPathMap.keyStoreByPage}?page=${page}`,
    fetcher,
  );

  const [keyStoreAccounts, setKeyStoreAccounts] = useState<
    Array<IKeyStoreAccount>
  >([]);

  async function getKeyStoreAccounts(name: string) {
    try {
      const url = `${userPathMap.keyStoreAccounts}?keystore=${name}&chain_id=${networkId}`;
      const res = await fetcher(url);
      const accounts = (res?.[0]?.accounts as Array<string>) || [];
      const count = res?.[0]?.count || 0;

      return {
        name,
        accounts,
        count,
      };
    } catch (e) {
      return {
        name,
        accounts: [],
        count: 0,
      };
    }
  }

  useEffect(() => {
    if (!keyStores?.length || !networkId) {
      return;
    }

    async function getItemAccounts() {
      const ksAcs = await Promise.all(
        keyStores.map((name: string) => {
          return getKeyStoreAccounts(name);
        }),
      );

      setKeyStoreAccounts(ksAcs);
    }

    getItemAccounts();
  }, [keyStores, networkId]);

  return keyStoreAccounts;
}
