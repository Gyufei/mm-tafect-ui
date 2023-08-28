import { useContext, useEffect, useState } from "react";
import { ArrowBigRight } from "lucide-react";

import { IToken } from "@/lib/types/token";
import { IKeyStoreAccount } from "@/lib/hooks/use-key-store-accounts";

import QueryAccountBalance from "@/components/token-swap/query-account-balance";
import OpSelect from "@/components/token-swap/op-select";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import TokenSelectAndInput, {
  ITokenNumDesc,
} from "@/components/token-swap/token-select-and-input";
import fetcher from "@/lib/fetcher";
import OpAdvanceOptions from "@/components/token-swap/op-advance-options";
import { TestTxResult } from "./test-tx-result";
import ActionTip, { IActionType } from "../shared/action-tip";
import { NetworkContext } from "@/lib/providers/network-provider";
import useSWRMutation from "swr/mutation";
import { GAS_TOKEN_ADDRESS, UNIT256_MAX } from "@/lib/constants";
import { UserEndPointContext } from "@/lib/providers/user-end-point-provider";
import { useAdvanceOptions } from "@/lib/hooks/use-advance-options";
import { UserManageContext } from "@/lib/providers/user-manage-provider";
import { replaceStrNum } from "@/lib/hooks/use-str-num";
import { Input } from "../ui/input";
import { useOp } from "@/lib/hooks/use-op";

export default function Op({
  tokens,
  keyStores,
  handleTokensChange,
  children,
}: {
  tokens: Array<IToken>;
  keyStores: Array<IKeyStoreAccount>;
  handleTokensChange: (_ts: Array<IToken>) => void;
  children?: React.ReactNode;
}) {
  const { currentUser } = useContext(UserManageContext);
  const { userPathMap } = useContext(UserEndPointContext);
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
  const [sendTxTipShow, setSendTxTipShow] = useState<boolean>(false);
  const [sendTxResult, setSendTxResult] = useState<{
    type: IActionType;
    message: string;
  } | null>();

  const [tokenApprove, setTokenApprove] = useState<ITokenNumDesc>({
    labelName: "Token",
    info: null,
    num: UNIT256_MAX,
  });
  const [tokenIn, setTokenIn] = useState<ITokenNumDesc>({
    labelName: "Token0",
    info: null,
    num: "",
  });
  const [tokenOut, setTokenOut] = useState<ITokenNumDesc>({
    labelName: "Token1",
    info: null,
    num: "",
  });
  const [isExactInput, setIsExactInput] = useState<boolean>(true);

  const [toAddress, setToAddress] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("");

  const { advanceOptions, setAdvanceOptions } = useAdvanceOptions(
    network?.chain_id || "",
    queryAccount,
  );

  const fetchEstimate = async (
    url: string,
    {
      arg,
    }: {
      arg: {
        inP: ITokenNumDesc;
        outP: ITokenNumDesc;
        exactInput: boolean;
      };
    },
  ) => {
    if (!selectedOp?.op_detail?.swap_router) return null;

    const { inP, outP, exactInput } = arg;
    const amount = Number(exactInput ? inP.num : outP.num);

    const query = new URLSearchParams();
    query.set("chain_id", network?.chain_id || "");
    query.set("token_in", inP.info?.address || "");
    query.set("token_out", outP.info?.address || "");
    query.set("token_amount", String(amount) || "");
    query.set("is_exact_input", exactInput ? "true" : "false");
    query.set("swap_router_address", selectedOp?.op_detail?.swap_router || "");

    const queryStr = query.toString();
    const res = await fetcher(`${url}?${queryStr}`);

    return res?.amount;
  };

  const { trigger: triggerEstimate } = useSWRMutation(
    `${userPathMap.estimateToken}`,
    fetchEstimate,
  );

  const handleTokenInChange = async (inParams: ITokenNumDesc) => {
    const preVal = JSON.parse(JSON.stringify(tokenIn));
    setTokenIn(inParams);

    const isSameToken = inParams.info?.address === tokenOut.info?.address;
    if (isSameToken) {
      setTokenOut({ ...tokenOut, num: inParams.num });
      return;
    }

    const isSameVal =
      inParams.info?.address === preVal.info?.address &&
      Number(inParams.num) === Number(preVal.num);
    if (isSameVal) return;

    if (Number(inParams.num) === 0) {
      setTokenOut({ ...tokenOut, num: "" });
      return;
    }

    if (inParams.info && inParams.num && tokenOut.info) {
      const result = await triggerEstimate({
        inP: inParams,
        outP: tokenOut,
        exactInput: true,
      });
      setTokenOut({ ...tokenOut, num: String(result || "") });
    }

    setIsExactInput(true);
  };

  const handleTokenOutChange = async (outParams: ITokenNumDesc) => {
    const preVal = JSON.parse(JSON.stringify(tokenOut));
    setTokenOut(outParams);

    const isSameToken = outParams.info?.address === tokenIn.info?.address;
    if (isSameToken) {
      setTokenIn({ ...tokenIn, num: outParams.num });
      return;
    }

    const isSameVal =
      outParams.info?.address === preVal.info?.address &&
      Number(outParams.num) === Number(preVal.num);
    if (isSameVal) return;

    if (Number(outParams.num) === 0) {
      setTokenIn({ ...tokenIn, num: "" });
      return;
    }

    if (outParams.info && outParams.num && tokenIn.info) {
      const result = await triggerEstimate({
        inP: tokenIn,
        outP: outParams,
        exactInput: false,
      });
      setTokenIn({ ...tokenIn, num: String(result || "") });
    }

    setIsExactInput(true);
  };

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

  const getApproveParams = () => {
    const commonParams = getCommonParams();
    const params = {
      ...commonParams,
      token: tokenApprove.info?.address || "",
      amount: UNIT256_MAX,
      spender: selectedOp?.op_detail?.swap_router || "",
    };

    if (!params.token || !params.amount) return null;
    return params;
  };

  const getTransferParams = () => {
    const commonParams = getCommonParams();

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
    const params = {
      ...commonParams,
      recipient: toAddress,
      token_in: tokenIn.info?.address || "",
      token_out: tokenOut.info?.address || "",
      amount: isExactInput ? tokenIn.num : tokenOut.num,
      swap_router_address: selectedOp?.op_detail?.swap_router || "",
      is_exact_input: isExactInput,
    };

    if (
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
    if (isApproveOp) return getApproveParams();
    if (isTransferOp) return getTransferParams();
    if (isSwapOp) return getSwapParams();
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
      handleShowTxResult(res);
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

      const isGasToken = tokenIn.info?.address === GAS_TOKEN_ADDRESS;
      const amountCost = isGasToken ? gasCost + Number(tokenIn.num) : gasCost;

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

      setSendTxTipShow(true);
      setSendTxResult({
        type: "success",
        message: `Your funds have been staked in the pool`,
      });
    } catch (e: any) {
      setSendTxResult({
        type: "error",
        message: `${e.status}: ${e.info}`,
      });
      setSendTxTipShow(true);
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

        {isApproveOp && (
          <div className="mt-3 flex items-center justify-between px-3">
            <TokenSelectAndInput
              tokens={tokens}
              tokenParams={tokenApprove}
              handleTokenParamsChange={setTokenApprove}
            />
          </div>
        )}

        {isSwapOp && (
          <div className="mt-3 flex items-center justify-between px-3">
            <TokenSelectAndInput
              tokens={tokens}
              tokenParams={tokenIn}
              handleTokenParamsChange={(tP) => handleTokenInChange(tP)}
            />
            <ArrowBigRight
              className="mx-1 mt-1 h-5 w-5 text-[#7d8998]"
              style={{
                transform: "translateY(10px)",
              }}
            />
            <TokenSelectAndInput
              tokens={tokens}
              tokenParams={tokenOut}
              handleTokenParamsChange={(tP) => handleTokenOutChange(tP)}
            />
          </div>
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
          className="h-10 w-32 rounded-md border border-primary text-primary"
          onClick={() => handleSign()}
        >
          Test Tx
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSend()}
          className="h-10 w-32 rounded-md border border-primary text-primary"
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
        open={sendTxTipShow}
        onOpenChange={setSendTxTipShow}
        message={sendTxResult?.message || ""}
      />
    </>
  );
}
