"use client";

import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { INetwork } from "@/lib/types/network";
import { SystemEndPointPathMap } from "@/lib/end-point";

export default function NetworkSelect({
  value,
  onSelect,
}: {
  value: INetwork | null;
  onSelect: (_net: INetwork | null) => void;
}) {
  const defaultNetworkId = "11155111";
  const [openPopover, setOpenPopover] = useState(false);

  const { data: networks }: { data: Array<INetwork> } = useSWR(
    SystemEndPointPathMap.networks,
    fetcher,
  );

  useEffect(() => {
    if (!value && networks?.length) {
      onSelect(
        networks.find((net) => net.chain_id === defaultNetworkId) || null,
      );
    }
  }, [networks]);

  function handleSelectNetwork(network: INetwork) {
    setOpenPopover(false);
    onSelect(network);
  }

  return (
    <Popover
      open={openPopover}
      onOpenChange={(isOpen) => setOpenPopover(isOpen)}
    >
      <PopoverTrigger>
        <div
          onClick={() => setOpenPopover(!openPopover)}
          className="flex cursor-pointer items-center transition-all duration-75 active:bg-gray-100"
        >
          <div className="mr-1 font-medium text-title-color">
            {value?.network_name || (
              <div className="text-content-color">Select Network</div>
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 text-gray-600 transition-all ${
              openPopover ? "rotate-180" : ""
            }`}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-1" align="start">
        <div className="rounded-md bg-white">
          {(networks || []).map((network) => (
            <button
              key={network.chain_id}
              onClick={() => handleSelectNetwork(network)}
              className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
              style={{
                backgroundColor:
                  network.chain_id === value?.chain_id ? "#F5F5F5" : "",
              }}
            >
              {network.network_name}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
