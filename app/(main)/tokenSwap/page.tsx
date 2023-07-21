"use client";

import { useState } from "react";
import { DetailItem } from "@/components/common/DetailItem";
import NetworkSelect from "@/components/common/NetworkSelect/network-select";
import { Check, ChevronDown, Key } from "lucide-react";
import Popover from "@/components/shared/popover";
import * as Checkbox from "@radix-ui/react-checkbox";
import Select, { SelectItem } from "@/components/shared/select";
import { Input } from "@chakra-ui/react";

export default function TokenSwap() {
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [currentKeyStore, setCurrentKeyStore] = useState({
    name: "KeyStore 1",
    tag: 2,
  });

  const handleSelectNetwork = (networkOption: any) => {
    setCurrentNetwork(networkOption.id);
  };

  const handleSelectKeyStore = (keyStore: any) => {
    setCurrentKeyStore(keyStore);
  };

  const [openPopover, setOpenPopover] = useState(false);

  const keyStores = [
    { name: "KeyStore 1", tag: 1 },
    { name: "KeyStore 2", tag: 2 },
    { name: "KeyStore 3", tag: 3 },
    { name: "KeyStore 4", tag: 4 },
  ];

  function KeyStoreSelect() {
    return (
      <Popover
        content={
          <div className="max-w-[340px] rounded-md bg-white p-2">
            <div className="flex flex-col">
              <div className="flex items-center text-sm text-second-color">
                Available KeyStores
              </div>
              <div className="flex flex-wrap">
                {keyStores.map((option) => (
                  <div
                    key={option.name}
                    className="flex w-[160px] cursor-pointer items-center"
                  >
                    <Checkbox.Root
                      className="CheckboxRoot h-4 w-4"
                      defaultChecked
                      id={option.name}
                      checked={currentKeyStore.name === option.name}
                      onCheckedChange={() => handleSelectKeyStore(option)}
                    >
                      <Checkbox.Indicator className="CheckboxIndicator">
                        <Check className="h-3 w-3" strokeWidth={4} />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <label
                      className="Label flex items-center"
                      htmlFor="Auto-Flow"
                    >
                      {option.name}
                      <div className="Tag ml-2 bg-[#e9eaee]">{option.tag}</div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          className="flex w-[160px] items-center transition-all duration-75 active:bg-gray-100"
          onClick={() => setOpenPopover(!openPopover)}
        >
          <div className="mr-2 text-title-color">{currentKeyStore.name}</div>
          <div className="Tag mr-2 bg-[#e9eaee]">{currentKeyStore.tag}</div>
          <ChevronDown
            className={`h-4 w-4 text-gray-600 transition-all ${
              openPopover ? "rotate-180" : ""
            }`}
          />
        </button>
      </Popover>
    );
  }

  const filterAccounts = [
    {
      address: "0x1234567890",
      eth: "0.0012",
      token: "0.0032",
      tag: 33,
    },
    {
      address: "0x1234567890",
      eth: "0.0012",
      token: "0.0032",
      tag: 33,
    },
    {
      address: "0x1234567890",
      eth: "0.0012",
      token: "0.0032",
      tag: 33,
    },
  ];

  const tokens = [
    {
      name: "ETH",
    },
    {
      name: "BNB",
    },
    {
      name: "USDT",
    },
  ];

  function TokenByAccount() {
    return (
      <div className="flex flex-col justify-stretch">
        <div className="flex flex-col px-4">
          <div className="text-sm text-second-color ">Token</div>
          <div className="my-1">
            <Select placeholder="Select">
              {tokens.map((token) => (
                <SelectItem key={token.name} value={token.name}>
                  {token.name}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex items-center">
            <Input className="rounded" placeholder="Min" type="text" />
            <div className="mx-2">-</div>
            <Input className="rounded" placeholder="Max" type="text" />
          </div>
        </div>
        <div>
          <button>Filter Account</button>
          {filterAccounts.map((acc, index) => (
            <div key={acc.address} className="flex">
              <div>{index}</div>
              <div>
                <div>{acc.address}</div>
                <div>
                  <div>{acc.eth}</div>
                  <div>{acc.token}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function FirstCol() {
    return (
      <div className="h-full flex-1 border-r border-r-[#dadada]">
        <div className="flex flex-col p-4">
          <DetailItem title="Network">
            <NetworkSelect
              value={currentNetwork}
              onSelect={(e) => handleSelectNetwork(e)}
            />
          </DetailItem>
          <DetailItem title="KeyStore">
            <KeyStoreSelect />
          </DetailItem>
        </div>
        <TokenByAccount />
      </div>
    );
  }

  return (
    <div className="flex h-full items-stretch bg-[#fafafa]">
      <FirstCol />
      <div className="flex flex-1 flex-col border-r border-r-[#dadada]"></div>
      <div className="flex-1"></div>
    </div>
  );
}
