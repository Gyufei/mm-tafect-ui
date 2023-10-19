import { useContext, useEffect, useState } from "react";

import fetcher from "@/lib/fetcher";
import { UserEndPointContext } from "../providers/user-end-point-provider";
import { IAccountGas } from "@/components/key-store/key-store-accounts-table";
import { usePageKeystores } from "./use-page-keystores";
import { IKeyStore } from "../types/keystore";

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

export function useKeyStoreAccounts(networkId: string | null, page: string) {
  const { userPathMap } = useContext(UserEndPointContext);

  const { data: keyStores } = usePageKeystores(page);

  const [keyStoreAccounts, setKeyStoreAccounts] = useState<
    Array<IKeyStoreAccount>
  >([]);

  async function getKeyStoreAccounts(name: string): Promise<IKeyStoreAccount> {
    try {
      const url = `${userPathMap.keyStoreAccounts}?keystore=${name}&chain_id=${networkId}`;
      const res = await fetcher(url);

      const ks = keyStores.find((k) => k.keystore_name === name);
      if (!ks) throw new Error("keystore not found");

      const rangeNum = ks.range?.length || res.length;
      const accountRange = res.slice(0, rangeNum);
      const targetAcc = accountRange.reduce(
        (acc: Array<IAccountGas>, k: Record<string, any>) => {
          return acc.concat(k.accounts);
        },
        [],
      );

      return {
        name,
        accounts: targetAcc,
        count: targetAcc.length,
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
        keyStores.map((ks: IKeyStore) => {
          return getKeyStoreAccounts(ks.keystore_name);
        }),
      );

      setKeyStoreAccounts(ksAcs);
    }

    getItemAccounts();
  }, [keyStores, networkId]);

  return keyStoreAccounts;
}
