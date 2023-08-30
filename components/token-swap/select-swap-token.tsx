import { ArrowBigRight } from "lucide-react";
import { IToken } from "@/lib/types/token";
import TokenSelectAndInput, { ITokenNumDesc } from "./token-select-and-input";
import { useTokenSwap } from "@/lib/hooks/use-token-swap";

export default function SelectSwapToken({
  tokens,
  token0,
  token1,
  setToken0,
  setToken1,
  swapRouter,
  account
}: {
  account: string;
  swapRouter: string;
  tokens: Array<IToken>;
  token0: ITokenNumDesc;
  token1: ITokenNumDesc;
  setToken0: (_t: ITokenNumDesc) => void;
  setToken1: (_t: ITokenNumDesc) => void;
}) {
  const {
    handleToken0Change,
    handleToken0NumChange,
    handleToken1Change,
    handleToken1NumChange,
  } = useTokenSwap(account, swapRouter, token0, token1, setToken0, setToken1);

  return (
    <div className="mt-3 flex items-center justify-between px-3">
      <TokenSelectAndInput
        label="Token0"
        tokens={tokens}
        token={token0.token}
        tokenNum={token0.num}
        handleTokenChange={handleToken0Change}
        handleTokenNumChange={handleToken0NumChange}
      />
      <ArrowBigRight
        className="mx-1 mt-1 h-5 w-5 text-[#7d8998]"
        style={{
          transform: "translateY(10px)",
        }}
      />
      <TokenSelectAndInput
        label="Token1"
        tokens={tokens}
        token={token1.token}
        tokenNum={token1.num}
        handleTokenChange={handleToken1Change}
        handleTokenNumChange={handleToken1NumChange}
      />
    </div>
  );
}
