"use client";
import { useState } from "react";
import Popover from "@/components/shared/popover";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check, ChevronDown } from "lucide-react";

import "./index.css";
import { IKeyStore } from "@/lib/types/keyStore";

export default function KeyStoreItem() {
  const [keyStoreItem, setKeyStoreItem] = useState<IKeyStore | null>({
    address: [
      { address: "0x123123", gas: 0.333 },
      { address: "0x231312", gas: 0.55 },
    ],
    gasAvailable: 0.01,
    tx: 123,
    defaultNetwork: 1,
    worksFor: 1,
  });

  const networks = [
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

  const worksForOptions = [
    {
      value: 1,
      label: "Auto-Flow",
    },
    {
      value: 2,
      label: "Token-swap",
    },
  ];

  const [openPopover, setOpenPopover] = useState(false);

  const [currentNetwork, setCurrentNetwork] = useState(
    keyStoreItem?.defaultNetwork,
  );

  const [currentWorksFor, setCurrentWorksFor] = useState(
    keyStoreItem?.worksFor,
  );

  const handleSelectNetwork = (networkOption: any) => {
    setCurrentNetwork(networkOption.id);
    setOpenPopover(false);
  };

  const handleCheckWorksFor = (worksForOption: any) => {
    setCurrentWorksFor(worksForOption.value);
  };

  function BaseDetail() {
    return (
      <>
        <div className="detail-item">
          <div className="detail-item-title">Address</div>
          <div className="detail-item-text">
            {keyStoreItem?.address?.length}
          </div>
        </div>
        <div className="detail-item">
          <div className="detail-item-title">Gas Available</div>
          <div className="detail-item-text">{keyStoreItem?.gasAvailable}</div>
        </div>
        <div className="detail-item">
          <div className="detail-item-title">Tx</div>
          <div className="detail-item-text">{keyStoreItem?.tx}</div>
        </div>
      </>
    );
  }

  function NetworkSelect() {
    const currentNetworkName = networks.find(
      (network) => network.id === currentNetwork,
    )?.name;
    return (
      <Popover
        content={
          <div className="w-full rounded-md bg-white p-2 sm:w-40">
            {networks.map((network) => (
              <button
                key={network.id}
                onClick={() => handleSelectNetwork(network)}
                className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
              >
                {network.name}
              </button>
            ))}
          </div>
        }
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className="flex w-[160px] cursor-pointer items-center transition-all duration-75 active:bg-gray-100"
        >
          <p className="mr-1 font-medium text-title-color">
            {currentNetworkName}
          </p>
          <ChevronDown
            className={`h-4 w-4 text-gray-600 transition-all ${
              openPopover ? "rotate-180" : ""
            }`}
          />
        </button>
      </Popover>
    );
  }

  function WorksForSelect() {
    return (
      <div className="flex w-full items-center">
        <div className="flex items-center">
          {worksForOptions.map((option) => (
            <div
              key={option.value}
              className="mr-10 flex cursor-pointer items-center"
            >
              <Checkbox.Root
                className="CheckboxRoot h-4 w-4"
                defaultChecked
                id={option.label}
                checked={currentWorksFor === option.value}
                onCheckedChange={() => handleCheckWorksFor(option)}
              >
                <Checkbox.Indicator className="CheckboxIndicator">
                  <Check className="h-3 w-3" strokeWidth={4} />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label className="Label" htmlFor="Auto-Flow">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-stretch bg-[#fafafa]">
      <div className="ks-detail flex w-[400px] flex-col justify-between px-3 pb-4 pt-3">
        <div className="flex flex-col justify-stretch">
          <BaseDetail />
          <div className="detail-item">
            <div className="detail-item-title">Default Network</div>
            <NetworkSelect />
          </div>
          <div className="detail-item">
            <div className="detail-item-title">Works for</div>
            <WorksForSelect />
          </div>
        </div>
      </div>
    </div>
  );
}
