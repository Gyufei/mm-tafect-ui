import TokenSelect from "@/components/token-swap/token-select";
import { Input } from "@/components/ui/input";
import { IToken } from "@/lib/types/token";

export interface ITokenNumDesc {
  labelName: string;
  info: IToken | null;
  num: string;
}

export default function TokenSelectAndInput({
  tokens,
  tokenParams,
  handleTokenParamsChange,
}: {
  tokens: Array<IToken>;
  tokenParams: ITokenNumDesc;
  handleTokenParamsChange: (_t: ITokenNumDesc) => void;
}) {
  const handleTokenSelect = (token: IToken | null) => {
    handleTokenParamsChange({
      ...tokenParams,
      info: token,
    });
  };

  const handleNumChange = (num: string) => {
    handleTokenParamsChange({
      ...tokenParams,
      num,
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="LabelText mb-1">{tokenParams.labelName}</div>
      <TokenSelect
        tokens={tokens}
        token={tokenParams.info}
        handleTokenSelect={(e) => handleTokenSelect(e)}
      />
      <div className="ml-2 h-3 border-l border-border-color" />
      <Input
        value={tokenParams.num}
        onChange={(e) => handleNumChange(e.target.value)}
        className="rounded-md border-border-color"
        placeholder="0"
      />
    </div>
  );
}
