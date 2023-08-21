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

  useEffect(() => {
    if (!keyStores?.length) {
      return;
    }

    async function getItemAccounts() {
      const ksAcs = await Promise.all(
        keyStores.map(async (name: string) => {
          const res = await fetcher(
            `${userPathMap.keyStoreAccounts}?keystore=${name}&chain_id=${networkId}`,
          );
          const accounts = (res?.[0]?.accounts as Array<string>) || [];
          const count = res?.[0]?.count;
          return { name, accounts, count };
        }),
      );

      setKeyStoreAccounts(ksAcs);
    }

    getItemAccounts();
  }, [keyStores]);

  return keyStoreAccounts;
}
