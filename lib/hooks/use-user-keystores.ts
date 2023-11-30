import useSWR from "swr";
import { SystemEndPointPathMap } from "../end-point";
import fetcher from "../fetcher";
import { useCallback, useMemo } from "react";
import { IKeyStore } from "../types/keystore";

export function useUserKeystores() {
  const { data: allKeyStores, mutate: refetchAllKeyStores } = useSWR(
    SystemEndPointPathMap.allKeyStores,
    fetcher,
  );

  const {
    data: useKeyStoreNames,
    isLoading,
    mutate: refetchKeyStores,
  } = useSWR(SystemEndPointPathMap.userKeyStores, fetcher);

  const userKeyStores = useMemo<Array<IKeyStore>>(() => {
    if (!allKeyStores) return [];

    const ks = allKeyStores
      .filter((k: IKeyStore) => {
        return useKeyStoreNames?.includes(k.keystore_name);
      })
      .map((k: Record<string, any>) => {
        return {
          ...k,
          range: JSON.parse(k.range || "[]"),
        };
      });

    return ks;
  }, [allKeyStores, useKeyStoreNames]);

  const refresh = useCallback(async () => {
    await refetchAllKeyStores();
    await refetchKeyStores();
  }, [refetchAllKeyStores, refetchKeyStores]);

  return {
    data: userKeyStores,
    isLoading,
    mutate: refresh,
  };
}
