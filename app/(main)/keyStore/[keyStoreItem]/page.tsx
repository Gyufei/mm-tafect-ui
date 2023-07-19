"use client";
import { useState } from "react";
import Popover from "@/components/shared/popover";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check, ChevronDown, Trash2 } from "lucide-react";

import "./index.css";
import { IKeyStore } from "@/lib/types/keyStore";
import CopyIcon from "@/components/shared/copy-icon";
import { displayText } from "@/lib/utils";

export default function KeyStoreItem() {
  const [keyStoreItem, setKeyStoreItem] = useState<IKeyStore | null>({
    address: [
      { address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8", gas: 0.333 },
      { address: "0x3170ed0880ac9a755fd29b2688956bd959f933f8", gas: 0.55 },
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

  const handleDeleteKs = () => {};

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

  function DetailCol() {
    return (
      <div
        className="ks-detail flex w-[400px] flex-col justify-between px-3 pb-4 pt-3"
        style={{
          boxShadow: "inset -1px 0px 0px 0px #d6d6d6",
        }}
      >
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
        <div className="flex w-full justify-end pr-2">
          <Trash2
            onClick={() => handleDeleteKs()}
            className="h-5 w-5 cursor-pointer hover:text-[#ec5b55]"
          />
        </div>
      </div>
    );
  }

  function AddressCol() {
    return (
      <div className="flex flex-1 flex-col justify-stretch">
        <div
          style={{
            boxShadow: "inset 0px -1px 0px 0px #D6D6D6",
          }}
          className="bg-custom-bg-white px-3 py-2 "
        >
          <input
            className="Input rounded-3xl bg-custom-bg-white"
            type="text"
            placeholder="Search"
          />
        </div>
        <table>
          <thead className="h-10 bg-white text-second-color">
            <tr className="border-b border-[#d6d6d6]">
              <th className="font-normal">#</th>
              <th className="text-left  font-normal">Address</th>
              <th className="text-left  font-normal">Gas</th>
            </tr>
          </thead>
          <tbody>
            {keyStoreItem?.address?.map((address, index) => (
              <tr key={index} className="h-[56px] border-b border-[#d6d6d6]">
                <td className="min-w-[40px] max-w-[40px] text-center">
                  {index}
                </td>
                <td>
                  <div className="flex items-center">
                    {displayText(address.address)}
                    <CopyIcon text={address.address} />
                  </div>
                </td>
                <td>{address.gas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-stretch bg-[#fafafa]">
      <DetailCol />
      <AddressCol />
    </div>
  );
}
