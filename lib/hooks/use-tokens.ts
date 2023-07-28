import { uniqBy } from "lodash";
import useSWR from "swr";

import fetcher from "@/lib/fetcher";
import { PathMap } from "@/lib/path-map";

export function useTokens(networkId: string | null) {
  const tokenFetcher = async (url: string) => {
    if (!networkId) return [];

    const resTokens = await fetcher(url);
    const uniqueT = uniqBy(resTokens || [], "address") as any;
    return uniqueT;
  };

  const result = useSWR(
    `${PathMap.tokenList}?chain_id=${networkId}`,
    tokenFetcher,
  );

  return result;
}
