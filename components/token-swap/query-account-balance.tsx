import { IToken } from "@/lib/types/token";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import useSWRMutation from "swr/mutation";
import { PathMap } from "@/lib/path-map";
import fetcher from "@/lib/fetcher";
import { useEffect, useMemo } from "react";
import { useTokens } from "@/lib/hooks/use-tokens";
import { INetwork } from "@/lib/types/network";

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

export default function QueryAccountBalance({
  network,
  account,
  token,
  handleAccountChange,
}: {
  network: INetwork | null;
  account: string;
  token: IToken | null;
  handleAccountChange: (_acc: string) => void;
}) {
  const { data: tokens }: { data: Array<IToken> } = useTokens(
    network?.chain_id || null,
  );

  useEffect(() => {
    resetAccountBalance();
  }, [network?.chain_id]);

  const gasToken =
    (tokens || []).find((t: IToken) => t.symbol === network?.currency_symbol) ||
    (tokens || []).find((t: IToken) => t.symbol === "ETH");

  const stableToken = (tokens || []).find((t: IToken) => t.symbol === "USDT");

  const getAccountBalanceQuery = () => {
    const queryParams = new URLSearchParams();

    if (network) {
      queryParams.set("chain_id", network?.chain_id.toString());
    }

    if (account) {
      queryParams.set("account", account);
    }

    if (token) {
      const queryTokens = [
        gasToken?.address,
        token.address,
        stableToken?.address,
      ];
      queryParams.set("tokens", queryTokens.join(","));
    }

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

      <div className="mt-1 flex justify-between gap-x-3 px-3">
        <SmallTokenCard
          className="flex-1"
          name={gasToken?.symbol}
          num={accountBalances[0]}
        />
        <SmallTokenCard
          className="flex-1"
          name={token?.symbol || "Token"}
          num={accountBalances[1] || 0}
        />
        <SmallTokenCard
          className="flex-1"
          name={stableToken?.symbol}
          num={accountBalances[2] || 0}
        />
      </div>
    </>
  );
}
