import { useContext, useEffect, useState } from "react";

import fetcher from "@/lib/fetcher";
import { UserEndPointContext } from "../providers/user-end-point-provider";
import { IAccountGas } from "@/components/key-store/key-store-accounts-table";
import { usePageKeystores } from "./use-page-keystores";
import { IKeyStore, IKeyStoreAccount, IKeyStoreRange } from "../types/keystore";

export function useKeyStoreAccounts(networkId: string | null, page: string) {
  const { userPathMap } = useContext(UserEndPointContext);

  const { data: keyStores } = usePageKeystores(page);

  const [keyStoreAccounts, setKeyStoreAccounts] = useState<
    Array<IKeyStoreAccount>
  >([]);

  const getRangeAccounts = (
    range: IKeyStoreRange,
    accounts: Array<IKeyStoreAccount>,
  ) => {
    if (!accounts) return [];

    const target =
      accounts.find((ks) => ks.accounts[0].account === range.root_account)
        ?.accounts || [];

    if (target?.length) {
      return target.slice(range.from_index, range.to_index + 1);
    }

    return target;
  };

  async function getKeyStoreAccounts(name: string): Promise<IKeyStoreAccount> {
    try {
      const url = `${userPathMap.keyStoreAccounts}?keystore=${name}&chain_id=${networkId}`;
      const res = await fetcher(url);

      const ks = keyStores.find((k) => k.keystore_name === name);
      if (!ks) throw new Error("keystore not found");

      const targetAcc = ks.range.reduce(
        (acc: Array<IAccountGas>, rangeItem: IKeyStoreRange) => {
          const targetAcc = getRangeAccounts(rangeItem, res);
          return acc.concat(targetAcc);
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
