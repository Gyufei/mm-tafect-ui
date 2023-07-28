"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import useSWR from "swr";
import { PathMap } from "@/lib/path-map";
import fetcher from "@/lib/fetcher";

export interface INetwork {
  block_explorer_url: string;
  chain_id: string;
  currency_symbol: string;
  network_name: string;
  rpc_url: string;
}

export default function NetworkSelect({
  value,
  onSelect,
}: {
  value: string | null;
  // eslint-disable-next-line no-unused-vars
  onSelect: (net: INetwork) => void;
}) {
  const [openPopover, setOpenPopover] = useState(false);

  const { data: networks }: { data: Array<INetwork> } = useSWR(
    PathMap.networks,
    fetcher,
  );

  const currentNetworkName = (networks || []).find(
    (network) => network.chain_id === value,
  )?.network_name;

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
            {currentNetworkName || (
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
      <PopoverContent className="w-36 p-1" align="start">
        <div className="rounded-md bg-white">
          {(networks || []).map((network) => (
            <button
              key={network.chain_id}
              onClick={() => handleSelectNetwork(network)}
              className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
              style={{
                backgroundColor: network.chain_id === value ? "#F5F5F5" : "",
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
