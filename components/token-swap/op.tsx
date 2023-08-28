import { useContext, useEffect, useState } from "react";
import { ArrowBigRight } from "lucide-react";

import { IOp } from "@/lib/types/op";
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

  const [selectedOp, setSelectedOp] = useState<IOp | null>(null);

  const [queryAccount, setQueryAccount] = useState<string>("");
  const [gasBalance, setGasBalance] = useState<number | null>(0);

  const [testTxDialogOpen, setTestTxDialogOpen] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [sendTxTipShow, setSendTxTipShow] = useState<boolean>(false);
  const [sendTxResult, setSendTxResult] = useState<{
    type: IActionType;
    message: string;
  } | null>();

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

  useEffect(() => {
    if (!selectedOp?.op_detail?.swap_router) return;

    if (tokenIn.info && tokenOut.info && (tokenIn.num || tokenOut.num)) {
      triggerEstimate({
        inP: tokenIn,
        outP: tokenOut,
        exactInput: isExactInput,
      }).then((result) => {
        if (isExactInput) {
          setTokenOut({ ...tokenOut, num: String(result || 0) });
        } else {
          setTokenIn({ ...tokenIn, num: String(result || 0) });
        }
      });
    }
  }, [selectedOp?.op_detail?.swap_router]);

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

  const getCommonParams = () => {
    const kStore = keyStores.find((ks) =>
      ks.accounts.some((a) => a.account === queryAccount),
    );

    const chain_id = network?.chain_id || "";
    const keystore = kStore?.name || "";
    const account = queryAccount;
    const token = tokenIn.info?.address || "";

    return {
      user_name: currentUser?.email,
      chain_id,
      account,
      token,
      keystore,
      ...advanceOptions,
    };
  };

  const getApproveParams = () => {
    const commonParams = getCommonParams();
    const params = {
      ...commonParams,
      amount: tokenIn.num || UNIT256_MAX,
      spender: selectedOp?.op_detail?.swap_router || "",
    };

    return params;
  };

  const getTransferParams = () => {
    const commonParams = getCommonParams();
    const params = {
      ...commonParams,
      amount:
        tokenIn.num ||
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      recipient: commonParams.account,
    };

    return params;
  };

  const getSwapParams = () => {
    const commonParams = getCommonParams();
    const params = {
      ...commonParams,
      recipient: commonParams.account,
      token_in: tokenIn.info?.address || "",
      token_out: tokenOut.info?.address || "",
      amount: isExactInput ? tokenIn.num : tokenOut.num,
      swap_router_address: selectedOp?.op_detail?.swap_router || "",
      is_exact_input: isExactInput,
    };

    return params;
  };

  function getTxParams() {
    switch (selectedOp?.op_id) {
      case 3:
        return getApproveParams();
      case 2:
        return getTransferParams();
      case 1:
        return getSwapParams();
      default:
        return null;
    }
  }

  function getSignUrl() {
    switch (selectedOp?.op_id) {
      case 3:
        return userPathMap.signApprove;
      case 2:
        return userPathMap.signTransfer;
      case 1:
        return userPathMap.signSwap;
      default:
        return null;
    }
  }

  function getScheduleUrl() {
    switch (selectedOp?.op_id) {
      case 3:
        return userPathMap.sendApprove;
      case 2:
        return userPathMap.sendTransfer;
      case 1:
        return userPathMap.sendSwap;
      default:
        return null;
    }
  }

  async function signAction() {
    const url = getSignUrl();
    const params = getTxParams();
    if (!url || !params) return;

    const res = await fetcher(url, {
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
      const url = getScheduleUrl();
      const params = getTxParams();
      if (!url || !params) return;
      await fetcher(url, {
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

        <OpAdvanceOptions
          options={advanceOptions}
          onChange={setAdvanceOptions}
        />
      </div>

      <div
        className="mt-3 flex items-center gap-x-3 border-t bg-white px-3 py-2"
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
