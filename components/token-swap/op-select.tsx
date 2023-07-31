import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import fetcher from "@/lib/fetcher";
import { PathMap } from "@/lib/path-map";
import { IOp } from "@/lib/types/op";
import useSWR from "swr";

export default function TokenSelect({
  op,
  networkId,
  handleOpSelect,
}: {
  op: IOp | null;
  networkId: string | null;
  handleOpSelect: (_o: IOp) => void;
}) {
  const { data: opList } = useSWR(() => {
    return networkId ? `${PathMap.ops}?chain_id=${networkId}` : null;
  }, fetcher);

  const handleSelect = (opName: string) => {
    const op = opList.find((op: Record<string, any>) => op.op_name === opName);
    handleOpSelect(op);
  };

  return (
    <Select value={op?.op_name} onValueChange={(e) => handleSelect(e)}>
      <SelectTrigger>
        <SelectValue placeholder="Select OP" />
      </SelectTrigger>
      <SelectContent>
        {(opList || []).map((op: Record<string, string>) => (
          <SelectItem key={op.op_name} value={op.op_name}>
            {op.op_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
