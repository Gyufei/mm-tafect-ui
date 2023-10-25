import useSWR from "swr";
import { SystemEndPointPathMap } from "../end-point";
import fetcher from "../fetcher";
import { useContext, useEffect, useMemo } from "react";
import { IKeyStore } from "../types/keystore";
import { UserManageContext } from "../providers/user-manage-provider";

export function usePageKeystores(page: string) {
  const { currentUser } = useContext(UserManageContext);

  const { data: allKeyStores } = useSWR(
    SystemEndPointPathMap.allKeyStores,
    fetcher,
  );

  const { data: pageKeyStoreNames, mutate: getPageKeyStoreNames } = useSWR(
    `${SystemEndPointPathMap.keyStoreByPage}?page_name=${page}`,
    fetcher,
  );

  useEffect(() => {
    getPageKeyStoreNames();
  }, [currentUser, getPageKeyStoreNames]);

  const userKeyStores = useMemo<Array<IKeyStore>>(() => {
    if (!allKeyStores) return [];

    const ks = allKeyStores
      .filter((k: IKeyStore) => {
        return pageKeyStoreNames?.includes(k.keystore_name);
      })
      .map((k: Record<string, any>) => {
        return {
          ...k,
          range: JSON.parse(k.range || "[]"),
        };
      });

    return ks;
  }, [allKeyStores, pageKeyStoreNames]);

  return {
    data: userKeyStores,
  };
}
