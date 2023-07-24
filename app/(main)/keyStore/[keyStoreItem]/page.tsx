"use client";
import { useState } from "react";
import Popover from "@/components/shared/popover";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check, Trash2 } from "lucide-react";

import "./index.css";
import { IKeyStore } from "@/lib/types/keyStore";
import CopyIcon from "@/components/shared/copy-icon";
import { displayText } from "@/lib/utils";
import DetailItem from "@/components/common/DetailItem";
import NetworkSelect from "@/components/common/NetworkSelect/network-select";
import { Input } from "@chakra-ui/react";

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

  const [currentNetwork, setCurrentNetwork] = useState(
    keyStoreItem?.defaultNetwork || null,
  );

  const [currentWorksFor, setCurrentWorksFor] = useState(
    keyStoreItem?.worksFor,
  );

  const handleSelectNetwork = (networkOption: any) => {
    setCurrentNetwork(networkOption.id);
  };

  const handleCheckWorksFor = (worksForOption: any) => {
    setCurrentWorksFor(worksForOption.value);
  };

  const handleDeleteKs = () => {};

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
          <DetailItem title="Address">
            {keyStoreItem?.address?.length}
          </DetailItem>
          <DetailItem title="Gas Available">
            {keyStoreItem?.gasAvailable}
          </DetailItem>
          <DetailItem title="Tx">{keyStoreItem?.tx}</DetailItem>
          <DetailItem title="Default Network">
            <NetworkSelect
              value={currentNetwork}
              onSelect={(e) => handleSelectNetwork(e)}
            />
          </DetailItem>
          <DetailItem title="Works for">
            <WorksForSelect />
          </DetailItem>
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
          <Input
            className="rounded-3xl bg-custom-bg-white"
            type="text"
            placeholder="Search"
          />
        </div>
        <table>
          <thead className="h-10 bg-white text-second-color">
            <tr className="border-b border-shadow-color">
              <th className="font-normal">#</th>
              <th className="text-left font-normal">Address</th>
              <th className="text-left font-normal">Gas</th>
            </tr>
          </thead>
          <tbody>
            {keyStoreItem?.address?.map((address, index) => (
              <tr key={index} className="h-[56px] border-b border-shadow-color">
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
