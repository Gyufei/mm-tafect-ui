import { useContext, useEffect, useMemo, useState } from "react";
import useSWRMutation from "swr/mutation";

import { IToken } from "@/lib/types/token";
import { cn } from "@/lib/utils";
import { PathMap } from "@/lib/path-map";
import fetcher from "@/lib/fetcher";
import { Web3Context } from "@/lib/providers/web3-provider";
import { ETH_ADDRESS } from "@/lib/constants";

import { Input } from "../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function QueryAccountBalance({
  account,
  handleAccountChange,
  handleTokensChange,
}: {
  account: string;
  handleAccountChange: (_acc: string) => void;
  handleTokensChange: (_ts: Array<IToken>) => void;
}) {
  const { token: userToken, tokens, network } = useContext(Web3Context);
  const stableTokens = (tokens || []).filter((t: IToken) => t.is_stable_token);

  const gasToken =
    (tokens || []).find((t: IToken) => t.address === ETH_ADDRESS) || null;

  const [stableToken, setStableToken] = useState<IToken | null>(null);

  useEffect(() => {
    if (stableTokens.length > 0 && !stableToken) {
      const st = stableTokens.find((t) => t.symbol === "USDT") || null;
      setStableToken(st);
    }
  }, [stableTokens]);

  const handleStableTokenSelect = (add: string) => {
    const selected = stableTokens.find(
      (token: Record<string, any>) => token.address === add,
    );
    setStableToken(selected || null);
  };

  useEffect(() => {
    if (gasToken && userToken && stableToken) {
      handleTokensChange([gasToken, userToken, stableToken]);
    }
  }, [gasToken, userToken, stableToken]);

  const getAccountBalanceQuery = () => {
    const queryParams = new URLSearchParams();

    if (network) {
      queryParams.set("chain_id", network?.chain_id.toString());
    }

    if (account) {
      queryParams.set("account", account);
    }

    const queryTokens = [
      gasToken?.address,
      userToken?.address,
      stableToken?.address,
    ];
    queryParams.set("tokens", queryTokens.join(","));

    const query = queryParams.toString();

    return query;
  };

  const {
    data: accountBalanceRes,
    trigger: triggerAccountBalance,
    reset: resetAccountBalance,
  } = useSWRMutation(
    `${PathMap.accountTokensBalance}?${getAccountBalanceQuery()}`,
    fetcher as any,
  );

  useEffect(() => {
    resetAccountBalance();
  }, [network?.chain_id]);

  const accountBalances = useMemo(
    () => accountBalanceRes?.batch_balance_of || [0, 0, 0],
    [accountBalanceRes],
  );

  return (
    <>
      <div className="p-3 pt-0">
        <div className="LabelText mb-1">FromAddress</div>
        <div className="flex justify-between">
          <Input
            value={account}
            onChange={(e: any) => handleAccountChange(e.target.value)}
            className="mr-3 border-border-color bg-white"
            placeholder="0x11111111111"
          />
          <button
            onClick={() => triggerAccountBalance()}
            className="rounded-md border border-border-color bg-white px-6 font-bold text-title-color hover:bg-custom-bg-white"
          >
            Query
          </button>
        </div>
      </div>

      <div className="mt-1 grid grid-cols-3 gap-x-3 px-3">
        <SmallTokenCard name={gasToken?.symbol} num={accountBalances[0]} />
        <SmallTokenCard name={userToken?.symbol} num={accountBalances[1]} />
        <div className="flex flex-col rounded-md border bg-custom-bg-white px-4 py-2">
          <Select
            value={stableToken?.address || undefined}
            onValueChange={(e: string) => handleStableTokenSelect(e)}
          >
            <SelectTrigger
              style={{
                boxShadow: "none !important",
              }}
              className="LabelText h-[20px] max-w-[60px] border-0 bg-transparent p-0 shadow-none outline-none"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(stableTokens || []).map((t) => (
                <SelectItem key={t.address} value={t.address}>
                  {t.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-lg font-medium text-title-color">
            {accountBalances[2]}
          </div>
        </div>
      </div>
    </>
  );
}

function SmallTokenCard({
  name,
  num,
  className,
}: {
  name: string | undefined;
  num: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-md border bg-custom-bg-white px-4 py-2",
        className,
      )}
    >
      <div className="LabelText h-[20px]">{name}</div>
      <div className="text-lg font-medium text-title-color">{num}</div>
    </div>
  );
}
