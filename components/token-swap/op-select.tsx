import Image from "next/image";
import { useContext, useEffect, useMemo } from "react";
import useSWR from "swr";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SystemEndPointPathMap } from "@/lib/end-point";
import fetcher from "@/lib/fetcher";
import { NetworkContext } from "@/lib/providers/network-provider";
import { IOp } from "@/lib/types/op";

const ImgMap = {
  uniswap: "/icons/uniswap.svg",
  pancakeSwap: "/icons/pancakeswap.png",
  transfer: "/icons/transfer.svg",
};

export default function OpSelect({
  op,
  handleOpSelect,
}: {
  op: IOp | null;
  handleOpSelect: (_o: IOp) => void;
}) {
  const { network } = useContext(NetworkContext);
  const networkId = network?.chain_id;

  const { data: opList } = useSWR(() => {
    return networkId
      ? `${SystemEndPointPathMap.ops}?chain_id=${networkId}`
      : null;
  }, fetcher);

  const displayOpList = useMemo(() => {
    if (!opList?.length) return [];
    return opList.filter((op: Record<string, any>) => op.op_id !== 3);
  }, [opList]);

  useEffect(() => {
    if (opList?.length && !op) {
      handleOpSelect(opList.find((op: Record<string, any>) => op.op_id === 1));
    }
  }, [opList, op, handleOpSelect]);

  const handleSelect = (opName: string) => {
    const op = opList.find((op: Record<string, any>) => op.op_name === opName);
    handleOpSelect(op);
  };

  const getImageSrc = (op: IOp) => {
    if (!op) return "";

    if (op.op_id === 2) {
      return ImgMap.transfer;
    }

    if (op.op_id === 1) {
      if (op.op_name.includes("Pancake")) {
        return ImgMap.pancakeSwap;
      }

      if (op.op_name.includes("Uniswap")) {
        return ImgMap.uniswap;
      }
    }

    return "";
  };

  return (
    <Select value={op?.op_name} onValueChange={(e) => handleSelect(e)}>
      <SelectTrigger>
        <SelectValue placeholder="Select OP">
          {op ? (
            <div className="flex items-center">
              {getImageSrc(op) && (
                <Image
                  src={getImageSrc(op)}
                  width={20}
                  height={20}
                  alt="logo"
                />
              )}
              <span className="ml-1">{op.op_name}</span>
            </div>
          ) : null}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {(displayOpList || []).map((op: IOp) => (
          <SelectItem showIndicator={false} key={op.op_name} value={op.op_name}>
            <div className="flex items-center">
              {getImageSrc(op) && (
                <Image
                  src={getImageSrc(op)}
                  width={20}
                  height={20}
                  alt="logo"
                />
              )}
              <span className="ml-1">{op.op_name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
