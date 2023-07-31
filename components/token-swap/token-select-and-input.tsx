import TokenSelect from "@/components/token-swap/token-select";
import { Input } from "@/components/ui/input";
import { IToken } from "@/lib/types/token";

export interface ITokenAddressAndNum {
  labelName: string;
  info: IToken | null;
  num: string;
}

export default function TokenSelectAndInput({
  networkId,
  tokenParams,
  handleTokenParamsChange,
}: {
  networkId: string | null;
  tokenParams: ITokenAddressAndNum;
  handleTokenParamsChange: (_t: ITokenAddressAndNum) => void;
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
        networkId={networkId}
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
