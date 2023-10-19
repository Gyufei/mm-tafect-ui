import { useContext, useEffect, useMemo } from "react";
import useSWRMutation from "swr/mutation";

import { cn } from "@/lib/utils";
import fetcher from "@/lib/fetcher";
import { NetworkContext } from "@/lib/providers/network-provider";

import { Input } from "../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TokenContext } from "@/lib/providers/token-provider";
import { UserEndPointContext } from "@/lib/providers/user-end-point-provider";

export default function QueryAccountBalance({
  account,
  handleAccountChange,
  gas,
  setGas,
}: {
  account: string;
  handleAccountChange: (_acc: string) => void;
  gas: number | null;
  setGas: (_gas: number) => void;
}) {
  const { userPathMap } = useContext(UserEndPointContext);
  const { network } = useContext(NetworkContext);
  const {
    token: userToken,
    currencyToken,
    stableTokens,
    stableToken,
    setStableToken,
  } = useContext(TokenContext);

  const handleStableTokenSelect = (add: string) => {
    const selected = stableTokens.find(
      (token: Record<string, any>) => token.address === add,
    );
    setStableToken(selected || null);
  };

  useEffect(() => {
    if (currencyToken && userToken && stableToken && account) {
      triggerAccountBalance();
    }
  }, [currencyToken, userToken, stableToken]);

  const getAccountBalanceQuery = () => {
    const queryParams = new URLSearchParams();

    if (!network || !account) {
      return;
    }

    queryParams.set("chain_id", network?.chain_id.toString());
    queryParams.set("account", account);

    const queryTokens = [userToken?.address, stableToken?.address];
    queryParams.set("tokens", queryTokens.join(","));

    const query = queryParams.toString();

    return query;
  };

  const getGasBalanceQuery = () => {
    const queryParams = new URLSearchParams();

    if (!network || !account) {
      return;
    }

    queryParams.set("chain_id", network?.chain_id.toString());
    queryParams.set("account", account);

    const query = queryParams.toString();

    return query;
  };

  const {
    data: accountBalanceRes,
    trigger: triggerAccountBalance,
    reset: resetAccountBalance,
  } = useSWRMutation(
    `${userPathMap.accountTokensBalance}?${getAccountBalanceQuery()}`,
    fetcher as any,
  );

  const {
    data: gasBalanceRes,
    trigger: triggerGasBalance,
    reset: resetGasBalance,
  } = useSWRMutation(
    `${userPathMap.accountTokenBalance}?${getGasBalanceQuery()}`,
    fetcher as any,
  );

  useEffect(() => {
    if (gasBalanceRes) {
      setGas(gasBalanceRes?.balance_of || 0);
    }
  }, [gasBalanceRes]);

  const handleQuery = () => {
    if (!account) {
      return;
    }

    triggerGasBalance();
    triggerAccountBalance();
  };

  useEffect(() => {
    resetAccountBalance();
    resetGasBalance();
  }, [network?.chain_id]);

  const accountBalances = useMemo(
    () => accountBalanceRes?.batch_balance_of || [0, 0],
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
            onClick={() => handleQuery()}
            className="rounded-md border border-border-color bg-white px-6 font-bold text-title-color hover:bg-custom-bg-white"
          >
            Query
          </button>
        </div>
      </div>

      <div className="mt-1 grid grid-cols-3 gap-x-3 px-3">
        <SmallTokenCard name={currencyToken?.symbol} num={gas || 0} />
        <SmallTokenCard name={userToken?.symbol} num={accountBalances[0]} />
        <div className="flex flex-col rounded-md border bg-custom-bg-white px-4 py-2">
          <Select
            value={stableToken?.address || undefined}
            onValueChange={(e: string) => handleStableTokenSelect(e)}
          >
            <SelectTrigger
              style={{
                boxShadow: "none !important",
              }}
              className="LabelText h-[20px] max-w-[60px] border-0 bg-transparent p-0 shadow-none outline-none focus:shadow-none"
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
          <div className="TruncateSingleLine text-lg font-medium text-title-color">
            {accountBalances[1]}
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
      <div className="TruncateSingleLine text-lg font-medium text-title-color">
        {num}
      </div>
    </div>
  );
}
