import { useContext, useEffect, useState } from "react";
import { ArrowBigRight } from "lucide-react";
import { useDebounce } from "use-debounce";
import useSWR from "swr";

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
import { PathMap } from "@/lib/path-map";
import fetcher from "@/lib/fetcher";
import OpAdvanceOptions, {
  IAdvanceOptions,
} from "@/components/token-swap/op-advance-options";
import { TestTxResult } from "./test-tx-result";
import ActionTip, { IActionType } from "../shared/action-tip";
import { useSession } from "next-auth/react";
import { Web3Context } from "@/lib/providers/web3-provider";

export default function Op({
  tokens,
  keyStores,
  handleTokensChange,
}: {
  tokens: Array<IToken>;
  keyStores: Array<IKeyStoreAccount>;
  handleTokensChange: (_ts: Array<IToken>) => void;
}) {
  const { network } = useContext(Web3Context);
  const { data: session } = useSession();
  const [selectedOp, setSelectedOp] = useState<IOp | null>(null);
  const [queryAccount, setQueryAccount] = useState<string>("");

  const [testTxDialogOpen, setTestTxDialogOpen] = useState<boolean>(false);
  const [testTxResult, setTestTxResult] = useState<any>(null);

  const [sendTxTipShow, setSendTxTipShow] = useState<boolean>(false);
  const [sendTxResult, setSendTxResult] = useState<{
    type: IActionType;
    message: string;
  } | null>();

  const { data: gasPrice } = useSWR(() => {
    if (network?.chain_id) {
      return `${PathMap.gasPrice}?chain_id=${network?.chain_id}`;
    } else {
      return null;
    }
  }, fetcher);

  const { data: nonceData } = useSWR(() => {
    if (network?.chain_id && queryAccount) {
      return `${PathMap.nonceNum}?chain_id=${network?.chain_id}&account=${queryAccount}`;
    } else {
      return null;
    }
  }, fetcher);

  useEffect(() => {
    if (nonceData) {
      setAdvanceOptions({ ...advanceOptions, nonce: Number(nonceData.nonce) });
    }
  }, [nonceData]);

  useEffect(() => {
    if (gasPrice) {
      setAdvanceOptions({
        ...advanceOptions,
        gas: gasPrice.gas_price,
      });
    }
  }, [gasPrice]);

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

  const [estimateTokenAmount] = useDebounce(async (amount: number) => {
    if (!selectedOp?.op_detail?.swap_router) return null;

    const query = new URLSearchParams();
    query.set("chain_id", network?.chain_id || "");
    query.set("token_in", tokenIn.info?.address || "");
    query.set("token_out", tokenOut.info?.address || "");
    query.set("token_amount", String(amount) || "");
    query.set("is_exact_input", isExactInput ? "true" : "false");
    query.set("swap_router_address", selectedOp?.op_detail?.swap_router || "");

    const queryStr = query.toString();

    const url = `${PathMap.estimateToken}?${queryStr}`;

    try {
      const estimateRes = await fetcher(url);
      return estimateRes?.amount;
    } catch (e: any) {
      toast({
        variant: "destructive",
        description: e.info,
      });
      return null;
    }
  }, 1000);

  const handleTokenInChange = async (inParams: ITokenNumDesc) => {
    setTokenIn(inParams);
    setIsExactInput(true);
    if (inParams.info && inParams.num && tokenOut.info) {
      const amount = Number(inParams.num);
      const result = await estimateTokenAmount(amount);

      if (result) setTokenOut({ ...tokenOut, num: String(result) });
    }
  };

  const handleTokenOutChange = async (outParams: ITokenNumDesc) => {
    setTokenOut(outParams);
    setIsExactInput(false);
    if (outParams.info && outParams.num && tokenIn.info) {
      const amount = Number(outParams.num);
      const result = await estimateTokenAmount(amount);

      if (result) setTokenIn({ ...tokenIn, num: String(result) });
    }
  };

  const [advanceOptions, setAdvanceOptions] = useState<IAdvanceOptions>({
    schedule: null,
    timeout: 1800,
    slippage: "0.02",
    nonce: null,
    gas: null,
    fixed_gas: false,
    no_check_gas: false,
  });

  const getCommonParams = () => {
    const kStore = keyStores.find((ks) =>
      ks.accounts.some((a) => a.account === queryAccount),
    );

    const chain_id = network?.chain_id || "";
    const keystore = kStore?.name || "";
    const account = queryAccount;
    const token = tokenIn.info?.address || "";

    return {
      user_name: session?.user?.email,
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
      amount:
        tokenIn.num ||
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
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

  async function handleSign() {
    let url, params;
    if (selectedOp?.op_id === 3) {
      url = PathMap.signApprove;
      params = getApproveParams();
    } else if (selectedOp?.op_id === 2) {
      url = PathMap.signTransfer;
      params = getTransferParams();
    } else if (selectedOp?.op_id === 1) {
      url = PathMap.signSwap;
      params = getSwapParams();
    } else {
      return;
    }

    try {
      const res = await fetcher(url, {
        method: "POST",
        body: JSON.stringify(params),
      });
      handleShowTxResult(res);
    } catch (e: any) {
      toast({
        variant: "destructive",
        description: e.info,
      });
    }
  }

  const handleShowTxResult = (res: Record<string, any>) => {
    if (res.gaslimit) {
      res.gas = (Number(res.gaslimit) * Number(gasPrice.gas_price)) / 10 ** 18;
    }
    setTestTxResult(res);
    setTestTxDialogOpen(true);
  };

  async function handleSend() {
    let url, params;
    if (selectedOp?.op_id === 3) {
      url = PathMap.sendApprove;
      params = getApproveParams();
    } else if (selectedOp?.op_id === 2) {
      url = PathMap.sendTransfer;
      params = getTransferParams();
    } else if (selectedOp?.op_id === 1) {
      url = PathMap.sendSwap;
      params = getSwapParams();
    } else {
      return "";
    }

    try {
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
      setSendTxTipShow(true);
      setSendTxResult({
        type: "error",
        message: `${e.status}: ${e.info}`,
      });
    }
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
        className="flex items-center gap-x-3 border-t bg-white px-3 py-2"
        style={{
          boxShadow:
            "inset -1px 0px 0px 0px #D6D6D6,inset 0px 1px 0px 0px #D6D6D6",
        }}
      >
        <Button
          variant="outline"
          className="h-[40px] w-[120px] rounded-md border border-primary text-primary"
          onClick={() => handleSign()}
        >
          Test Tx
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSend()}
          className="h-[40px] w-[120px] rounded-md border border-primary text-primary"
        >
          Schedule
        </Button>
      </div>

      <TestTxResult
        open={testTxDialogOpen}
        result={testTxResult}
        onOpenChange={setTestTxDialogOpen}
      />

      <ActionTip
        type={sendTxResult?.type || "success"}
        show={sendTxTipShow}
        setShow={setSendTxTipShow}
        message={sendTxResult?.message || ""}
      />
    </>
  );
}
