import { useEffect, useState } from "react";
import { fetchClient } from "../fetchClient";
import { PathMap } from "../path";

export interface KeyStoreAccount {
  name: string;
  accounts: Array<string>;
}

export function useKeyStoreAccounts(keyStores: string[]) {
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
          const res = await fetchClient(
            `${PathMap.keyStoreAccounts}?keystore=${keyStore}`,
          );
          const resJson = await res?.json();
          const accounts = (resJson?.data?.accounts as Array<string>) || [];
          return { name: keyStore, accounts };
        }),
      );

      setKeyStoreAccounts(ksAcs);
    }

    getItemAccounts();
  }, [keyStores]);

  return keyStoreAccounts;
}
