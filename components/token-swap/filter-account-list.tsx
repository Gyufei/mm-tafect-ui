import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import useSWRMutation from "swr/mutation";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import TokenSelect from "@/components/token-swap/token-select";

import { displayText } from "@/lib/utils";
import { useStrNum } from "@/lib/hooks/use-str-num";
import { PathMap } from "@/lib/path-map";
import fetcher from "@/lib/fetcher";
import { IKeyStoreAccount } from "@/lib/hooks/use-key-store-accounts";
import { IToken } from "@/lib/types/token";

export default function FilterAccountList({
  networkId,
  token,
  keyStores,
  handleTokenSelect,
}: {
  networkId: string | null;
  token: IToken | null;
  keyStores: Array<IKeyStoreAccount>;
  handleTokenSelect: (_t: IToken | null) => void;
}) {
  const [tokenMin, setTokenMin] = useStrNum("");
  const [tokenMax, setTokenMax] = useStrNum("");

  useEffect(() => {
    handleTokenSelect(null);
    filterResultReset();
    setTokenMax("");
    setTokenMin("");
  }, [networkId]);

  const {
    data: accounts,
    isMutating: filtering,
    trigger: filterTrigger,
    reset: filterResultReset,
  } = useSWRMutation(
    () => `${PathMap.filterAccount}?${getFilterQuery()}`,
    fetcher as any,
  );

  function getFilterQuery() {
    const queryParams = new URLSearchParams();

    if (networkId) {
      queryParams.set("chain_id", networkId.toString());
    }

    if (keyStores.length) {
      queryParams.set(
        "keystore",
        keyStores.map((ks: any) => ks.name).join(","),
      );
    }

    if (token?.address) {
      queryParams.set("token_address", token.address);
    }

    if (tokenMin) {
      queryParams.set("token_amount_minimum", tokenMin.toString());
    }

    if (tokenMax) {
      queryParams.set("token_amount_maximum", tokenMax.toString());
    }

    const query = queryParams.toString();

    return query;
  }

  return (
    <div className="flex flex-col justify-stretch">
      <div className="flex flex-col px-4">
        <div className="LabelText mb-1">Token</div>
        <div className="mb-3">
          <TokenSelect
            networkId={networkId}
            token={token || null}
            handleTokenSelect={(e) => handleTokenSelect(e)}
          />
        </div>
        <div className="flex items-center">
          <Input
            value={tokenMin || ""}
            onChange={(e) => setTokenMin(e.target.value)}
            className="border-border-color bg-white"
            placeholder="Min"
          />
          <div className="mx-2">-</div>
          <Input
            value={tokenMax || ""}
            onChange={(e) => setTokenMax(e.target.value)}
            className="border-border-color bg-white"
            placeholder="Max"
          />
        </div>
      </div>
      <div className="relative mt-8 flex flex-col border-t border-shadow-color pt-5">
        <Button
          disabled={filtering}
          onClick={() => filterTrigger()}
          className="disabled:opacity-1 absolute top-[-20px] mx-3 flex w-[95%] items-center justify-center rounded border bg-white py-2 hover:bg-custom-bg-white"
        >
          {filtering && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
          )}
          <span className="text-title-color">Filter Account</span>
        </Button>
        <ScrollArea
          className="
        pb-2
    "
          style={{
            height: "calc(100vh - 413px)",
          }}
        >
          {Array.isArray(accounts) &&
            accounts.map((acc, index) => (
              <div
                key={acc.account}
                className="flex h-[73px] items-center justify-between border-b p-4"
              >
                <div className="self-start pl-2 pr-5 text-lg leading-none text-content-color">
                  {index + 1}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="text-lg font-medium text-title-color">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center">
                            {displayText(acc.account)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">{acc.account}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="LabelText flex">
                    <div className="mr-6">ETH {acc.gas_token_amount}</div>
                    <div>USDT {acc.quote_token_amount}</div>
                  </div>
                </div>
              </div>
            ))}
        </ScrollArea>
      </div>
    </div>
  );
}
