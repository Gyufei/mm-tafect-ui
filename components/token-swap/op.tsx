import { useContext, useState } from "react";

import { IToken } from "@/lib/types/token";
import { IKeyStoreAccount } from "@/lib/hooks/use-key-store-accounts";

import QueryAccountBalance from "@/components/token-swap/query-account-balance";
import OpSelect from "@/components/token-swap/op-select";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ITokenNumDesc } from "@/components/token-swap/token-select-and-input";
import fetcher from "@/lib/fetcher";
import OpAdvanceOptions from "@/components/token-swap/op-advance-options";
import { TestTxResult } from "./test-tx-result";
import ActionTip, { IActionType } from "../shared/action-tip";
import { NetworkContext } from "@/lib/providers/network-provider";
import { GAS_TOKEN_ADDRESS, UNIT256_MAX } from "@/lib/constants";
import { useAdvanceOptions } from "@/lib/hooks/use-advance-options";
import { UserManageContext } from "@/lib/providers/user-manage-provider";
import { replaceStrNum } from "@/lib/hooks/use-str-num";
import { Input } from "../ui/input";
import { useOp } from "@/lib/hooks/use-op";
import SelectSwapToken from "./select-swap-token";
import { useTokenAllowance } from "@/lib/hooks/use-token-allowance";

export default function Op({
  tokens,
  keyStores,
  handleTokensChange,
  children,
  afterAction,
}: {
  tokens: Array<IToken>;
  keyStores: Array<IKeyStoreAccount>;
  handleTokensChange: (_ts: Array<IToken>) => void;
  children?: React.ReactNode;
  afterAction: () => void;
}) {
  const { currentUser } = useContext(UserManageContext);
  const { network } = useContext(NetworkContext);

  const {
    op: selectedOp,
    setOp: setSelectedOp,
    opSignUrl,
    opSendUrl,
    isApproveOp,
    isTransferOp,
    isSwapOp,
  } = useOp();

  const [queryAccount, setQueryAccount] = useState<string>("");
  const [gasBalance, setGasBalance] = useState<number | null>(0);

  const [testTxDialogOpen, setTestTxDialogOpen] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [sendTxResult, setSendTxResult] = useState<{
    type: IActionType;
    message: string;
  } | null>();

  const [token0, setToken0] = useState<ITokenNumDesc>({
    token: null,
    num: "",
    allowance: "",
  });
  const [token1, setToken1] = useState<ITokenNumDesc>({
    token: null,
    num: "",
    allowance: "",
  });

  const shouldApproveToken0 = token0.token && token0.allowance === "0";
  const shouldApproveToken1 = token1.token && token1.allowance === "0";

  const [toAddress, setToAddress] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("");

  const { advanceOptions, setAdvanceOptions } = useAdvanceOptions(
    network?.chain_id || "",
    queryAccount,
  );

  const handleTransferAmountChange = (e: string) => {
    const reNum = replaceStrNum(e);
    setTransferAmount(reNum);
  };

  const getCommonParams = () => {
    const kStore = keyStores.find((ks) =>
      ks.accounts.some((a) => a.account === queryAccount),
    );

    const chain_id = network?.chain_id || "";
    const keystore = kStore?.name || "";
    const account = queryAccount;

    return {
      user_name: currentUser?.email,
      chain_id,
      account,
      keystore,
      ...advanceOptions,
    };
  };

  const getTransferParams = () => {
    const commonParams = getCommonParams();
    if (!commonParams) return null;

    // find chain real currency token
    const token = tokens.find(
      (t) =>
        t.symbol === network?.currency_symbol &&
        t.address !== GAS_TOKEN_ADDRESS,
    );

    const params = {
      ...commonParams,
      token: token?.address || "",
      amount: transferAmount || UNIT256_MAX,
      recipient: toAddress,
    };

    if (!params.token || !params.amount || !params.recipient) return null;
    return params;
  };

  const getSwapParams = () => {
    const commonParams = getCommonParams();
    if (!commonParams) return null;

    const params = {
      ...commonParams,
      recipient: toAddress,
      token_in: token0.token?.address || "",
      token_out: token1.token?.address || "",
      amount: token0.num,
      swap_router_address: selectedOp?.op_detail?.swap_router || "",
      is_exact_input: true,
    };

    if (
      !params.keystore ||
      !params.recipient ||
      !params.token_in ||
      !params.token_out ||
      !params.amount
    ) {
      return null;
    }

    console.log("here", params);
    return params;
  };

  function getTxParams() {
    if (isTransferOp) return getTransferParams();
    if (isSwapOp) return getSwapParams();
  }

  const getApproveParams = (tokenAddr: string) => {
    const commonParams = getCommonParams();
    if (!commonParams) return null;

    const params = {
      ...commonParams,
      token: tokenAddr || "",
      amount: UNIT256_MAX,
      spender: selectedOp?.op_detail?.swap_router || "",
    };

    if (!params.token || !params.amount) return null;
    return params;
  };

  async function approveAction(tokenAddr: string) {
    const params = getApproveParams(tokenAddr);
    if (!opSignUrl || !params) return;

    await fetcher(opSignUrl, {
      method: "POST",
      body: JSON.stringify(params),
    });

    const allowance = await triggerAllowance({
      tokenAddr,
    });

    return allowance;
  }

  const { triggerAllowance } = useTokenAllowance(
    selectedOp?.op_detail?.swap_router || "",
    queryAccount,
  );

  async function handleApprove() {
    try {
      if (shouldApproveToken0) {
        const allowance = await approveAction(token0.token?.address || "");

        setToken0({
          ...token0,
          allowance,
        });
      }

      if (shouldApproveToken1) {
        const allowance = await approveAction(token1.token?.address || "");

        setToken1({
          ...token1,
          allowance,
        });
      }

      setSendTxResult({
        type: "success",
        message: `Approve Success`,
      });
      afterAction();
    } catch (e: any) {
      setSendTxResult({
        type: "error",
        message: `${e.status}: ${e.info}`,
      });
    }
  }

  async function signAction() {
    const params = getTxParams();
    if (!opSignUrl || !params) return;

    const res = await fetcher(opSignUrl, {
      method: "POST",
      body: JSON.stringify(params),
    });

    return res;
  }

  async function handleSign() {
    try {
      const res = await signAction();
      if (!res) return;
      handleShowTxResult(res);
      afterAction();
    } catch (e: any) {
      toast({
        variant: "destructive",
        description: e.info,
      });
    }
  }

  function handleShowTxResult(res: Record<string, any>) {
    if (res.gaslimit) {
      res.gas = (Number(res.gaslimit) * Number(advanceOptions.gas)) / 10 ** 18;
    }
    setTestResult(res);
    setTestTxDialogOpen(true);
  }

  async function testTxBeforeSend() {
    try {
      const res = await signAction();
      if (!res || !res.gaslimit) {
        throw new Error("gas insufficient");
      }

      const gasCost =
        (Number(res.gaslimit) * Number(advanceOptions.gas)) / 10 ** 18;

      const isGasToken = token0.token?.address === GAS_TOKEN_ADDRESS;
      const amountCost = isGasToken ? gasCost + Number(token0.num) : gasCost;

      if (Number(amountCost) > Number(gasBalance || 0)) {
        throw new Error("gas insufficient");
      }

      return true;
    } catch (e) {
      setTestResult({
        gasInsufficient: true,
      });
      setTestTxDialogOpen(true);
      return null;
    }
  }

  async function sendAction() {
    try {
      const params = getTxParams();
      if (!opSendUrl || !params) return;

      await fetcher(opSendUrl, {
        method: "POST",
        body: JSON.stringify(params),
      });

      setSendTxResult({
        type: "success",
        message: `Your funds have been staked in the pool`,
      });
      afterAction();
    } catch (e: any) {
      setSendTxResult({
        type: "error",
        message: `${e.status}: ${e.info}`,
      });
    }
  }

  async function handleSend() {
    const testRes = await testTxBeforeSend();
    if (!testRes) return;

    await sendAction();
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="p-3">
          <div className="LabelText mb-1">OP</div>
          <OpSelect
            op={selectedOp}
            handleOpSelect={(op) => setSelectedOp(op)}
          />
        </div>

        <QueryAccountBalance
          account={queryAccount}
          handleAccountChange={(e: string) => setQueryAccount(e)}
          handleTokensChange={handleTokensChange}
          gas={gasBalance}
          setGas={setGasBalance}
        />

        {isSwapOp && (
          <SelectSwapToken
            account={queryAccount}
            tokens={tokens}
            token0={token0}
            token1={token1}
            setToken0={setToken0}
            setToken1={setToken1}
            swapRouter={selectedOp?.op_detail?.swap_router || ""}
          />
        )}

        {isTransferOp && (
          <div className="col mt-3 flex flex-col px-3">
            <div className="LabelText mb-1">Transfer Amount</div>
            <Input
              value={transferAmount}
              onChange={(e) => handleTransferAmountChange(e.target.value)}
              className="rounded-md border-border-color"
              placeholder="0"
            />
          </div>
        )}

        {!isApproveOp && (
          <div className="col mt-3 flex flex-col px-3">
            <div className="LabelText mb-1">ToAddress</div>
            <Input
              value={toAddress}
              onChange={(e: any) => setToAddress(e.target.value)}
              className="mr-3 border-border-color bg-white"
              placeholder="0x11111111111"
            />
          </div>
        )}

        <OpAdvanceOptions
          options={advanceOptions}
          onChange={setAdvanceOptions}
        />
      </div>

      <div
        className="mt-3 flex h-[60px] items-center gap-x-3 border-t bg-white px-3 py-2"
        style={{
          boxShadow:
            "inset -1px 0px 0px 0px #D6D6D6,inset 0px 1px 0px 0px #D6D6D6",
        }}
      >
        {children}
        <Button
          variant="outline"
          className="h-10 w-32 rounded-md border border-primary text-primary  hover:bg-primary hover:text-white"
          onClick={() => handleSign()}
        >
          Test Tx
        </Button>
        {isSwapOp && (shouldApproveToken0 || shouldApproveToken1) && (
          <Button
            variant="outline"
            className="h-10 w-32 rounded-md border border-primary text-primary  hover:bg-primary hover:text-white"
            onClick={() => handleApprove()}
          >
            Approve
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => handleSend()}
          className="h-10 w-32 rounded-md border border-primary text-primary hover:bg-primary hover:text-white"
        >
          Schedule
        </Button>
      </div>

      <TestTxResult
        open={testTxDialogOpen}
        message={testResult}
        onOpenChange={setTestTxDialogOpen}
        sureAction={() => sendAction()}
      />

      <ActionTip
        type={sendTxResult?.type || "success"}
        handleClose={() => setSendTxResult(null)}
        message={sendTxResult?.message || null}
      />
    </>
  );
}
