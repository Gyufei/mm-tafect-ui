import { useContext, useEffect, useMemo, useState } from "react";

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
import { TokenContext } from "@/lib/providers/token-provider";
import { Loader2 } from "lucide-react";
import useSwapAddressStore from "@/lib/state";

export default function Op({
  keyStores,
  children,
  afterAction,
}: {
  keyStores: Array<IKeyStoreAccount>;
  children?: React.ReactNode;
  afterAction: () => void;
}) {
  const { currentUser } = useContext(UserManageContext);
  const { network } = useContext(NetworkContext);
  const { gasToken } = useContext(TokenContext);

  const {
    op: selectedOp,
    setOp: setSelectedOp,
    opSignUrl,
    opSendUrl,
    isApproveOp,
    isTransferOp,
    isSwapOp,
    opApproveSendUrl,
  } = useOp();

  const fromAddress = useSwapAddressStore((state) => state.fromAddress);
  const toAddress = useSwapAddressStore((state) => state.toAddress);
  const setToAddress = useSwapAddressStore(
    (state) => state.action.setToAddress,
  );

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

  const shouldApproveToken0 = useMemo(() => {
    if (token0.token?.address === GAS_TOKEN_ADDRESS) return false;
    return token0.token && token0.allowance === "0";
  }, [token0]);

  const shouldApproveToken1 = useMemo(() => {
    if (token1.token?.address === GAS_TOKEN_ADDRESS) return false;
    return token1.token && token1.allowance === "0";
  }, [token1]);

  const [transferAmount, setTransferAmount] = useState<string>("");

  const { advanceOptions, setAdvanceOptions } = useAdvanceOptions(
    network?.chain_id || "",
    fromAddress,
  );

  const handleTransferAmountChange = (e: string) => {
    const reNum = replaceStrNum(e);
    setTransferAmount(reNum);
  };

  const getCommonParams = () => {
    const kStore = keyStores.find((ks) =>
      ks.accounts.some((a) => a.account === fromAddress),
    );

    const chain_id = network?.chain_id || "";
    const keystore = kStore?.name || "";
    const account = fromAddress;

    return {
      user_name: currentUser?.email,
      chain_id,
      account,
      keystore,
      ...advanceOptions,
      gas: advanceOptions.gas
        ? String(Number(advanceOptions.gas) * 10 ** 9)
        : null,
    };
  };

  const getTransferParams = () => {
    const commonParams = getCommonParams();
    if (!commonParams) return null;

    const params = {
      ...commonParams,
      token: gasToken?.address || "",
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
    if (!opApproveSendUrl || !params) return;

    await fetcher(opApproveSendUrl, {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  const { data: token0Allowance, mutate: trigger0Allowance } =
    useTokenAllowance(
      token0.token?.address || null,
      selectedOp?.op_detail?.swap_router || "",
      fromAddress,
    );

  useEffect(() => {
    if (token0Allowance) {
      setToken0({
        ...token0,
        allowance: token0Allowance,
      });
    }
  }, [token0Allowance]);

  const { data: token1Allowance, mutate: trigger1Allowance } =
    useTokenAllowance(
      token1.token?.address || null,
      selectedOp?.op_detail?.swap_router || "",
      fromAddress,
    );

  useEffect(() => {
    if (token1Allowance) {
      setToken1({
        ...token1,
        allowance: token1Allowance,
      });
    }
  }, [token1Allowance]);

  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  async function handleApprove() {
    setApproveLoading(true);
    try {
      if (shouldApproveToken0) {
        await approveAction(token0.token?.address || "");

        trigger0Allowance();
      }

      if (shouldApproveToken1) {
        await approveAction(token1.token?.address || "");

        trigger1Allowance();
      }

      setApproveLoading(false);
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
      setApproveLoading(false);
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

  const [testLoading, setTestLoading] = useState<boolean>(false);
  async function handleSign() {
    try {
      setTestLoading(true);
      const res = await signAction();
      setTestLoading(false);
      if (!res) return;
      handleShowTxResult(res);
      afterAction();
    } catch (e: any) {
      toast({
        variant: "destructive",
        description: e.info,
      });
      setTestLoading(false);
    }
  }

  function handleShowTxResult(res: Record<string, any>) {
    if (res.gaslimit) {
      res.gas = (Number(res.gaslimit) * Number(advanceOptions.gas)) / 10 ** 9;
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
        (Number(res.gaslimit) * Number(advanceOptions.gas)) / 10 ** 9;

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
      setSendLoading(false);
    }
  }

  const [sendLoading, setSendLoading] = useState<boolean>(false);
  async function handleSend() {
    setSendLoading(true);
    const testRes = await testTxBeforeSend();
    if (!testRes) return;

    await sendAction();
    setSendLoading(false);
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

        <QueryAccountBalance gas={gasBalance} setGas={setGasBalance} />

        {isSwapOp && (
          <SelectSwapToken
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
          disabled={testLoading}
          variant="outline"
          className="h-10 w-32 rounded-md border border-primary text-primary  hover:bg-primary hover:text-white"
          onClick={() => handleSign()}
        >
          <div className="flex items-center">
            <span>Test Tx</span>
            {testLoading && <Loader2 className="ml-1 h-4 w-4 animate-spin" />}
          </div>
        </Button>
        {isSwapOp && (shouldApproveToken0 || shouldApproveToken1) && (
          <Button
            disabled={approveLoading}
            variant="outline"
            className="h-10 w-32 rounded-md border border-primary text-primary  hover:bg-primary hover:text-white"
            onClick={() => handleApprove()}
          >
            <div className="flex items-center">
              <span>Approve</span>
              {approveLoading && (
                <Loader2 className="ml-1 h-4 w-4 animate-spin" />
              )}
            </div>
          </Button>
        )}
        <Button
          disabled={sendLoading}
          variant="outline"
          onClick={() => handleSend()}
          className="h-10 w-32 rounded-md border border-primary text-primary hover:bg-primary hover:text-white"
        >
          <div className="flex items-center">
            <span>Schedule</span>
            {sendLoading && <Loader2 className="ml-1 h-4 w-4 animate-spin" />}
          </div>
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
