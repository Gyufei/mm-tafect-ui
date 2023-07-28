import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IToken } from "@/lib/types/token";
import { useTokens } from "@/lib/hooks/use-tokens";

export default function TokenSelect({
  token,
  networkId,
  handleTokenSelect,
}: {
  networkId: string | null;
  token: IToken | null;
  // eslint-disable-next-line no-unused-vars
  handleTokenSelect: (dispatchState: IToken | null) => void;
}) {
  const { data: tokens }: { data: Array<IToken> } = useTokens(networkId);

  const handleSelect = (add: string) => {
    const token = tokens.find(
      (token: Record<string, any>) => token.address === add,
    );
    handleTokenSelect(token || null);
  };

  return (
    <Select
      value={token?.address || undefined}
      onValueChange={(e) => handleSelect(e)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select Token" />
      </SelectTrigger>
      <SelectContent>
        {(tokens || []).map((token) => (
          <SelectItem key={token.symbol} value={token.address}>
            {token.symbol}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
