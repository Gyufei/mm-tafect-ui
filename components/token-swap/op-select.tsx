import { useContext } from "react";
import useSWR from "swr";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import fetcher from "@/lib/fetcher";
import { PathMap } from "@/lib/path-map";
import { Web3Context } from "@/lib/providers/web3-provider";
import { IOp } from "@/lib/types/op";

export default function OpSelect({
  op,
  handleOpSelect,
}: {
  op: IOp | null;
  handleOpSelect: (_o: IOp) => void;
}) {
  const { network } = useContext(Web3Context);
  const networkId = network?.chain_id;

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