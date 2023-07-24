import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

export interface INetwork {
  id: number;
  name: string;
}

export default function NetworkSelect({
  value,
  onSelect,
}: {
  value: number | null;
  onSelect: (net: INetwork) => void;
}) {
  const [openPopover, setOpenPopover] = useState(false);

  const networks: Array<INetwork> = [
    {
      id: 1,
      name: "Ethereum",
    },
    {
      id: 56,
      name: "Binance",
    },
    {
      id: 11155111,
      name: "Sepolia",
    },
  ];

  const currentNetworkName = networks.find(
    (network) => network.id === value,
  )?.name;

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
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className="flex cursor-pointer items-center transition-all duration-75 active:bg-gray-100"
        >
          <p className="mr-1 font-medium text-title-color">
            {currentNetworkName || (
              <div className="text-content-color">Select Network</div>
            )}
          </p>
          <ChevronDown
            className={`h-4 w-4 text-gray-600 transition-all ${
              openPopover ? "rotate-180" : ""
            }`}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-36 p-1" align="start">
        <div className="rounded-md bg-white">
          {networks.map((network) => (
            <button
              key={network.id}
              onClick={() => handleSelectNetwork(network)}
              className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
              style={{
                backgroundColor: network.id === value ? "#F5F5F5" : "",
              }}
            >
              {network.name}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
