"use client";
import { useState } from "react";
import cx from "classnames";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Collapsible from "@radix-ui/react-collapsible";
import {
  ArrowBigRight,
  ChevronDownCircle,
  Check,
  ChevronDown,
  Unlock,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DetailItem from "@/components/common/DetailItem";
import NetworkSelect from "@/components/common/NetworkSelect/network-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { displayText } from "@/lib/utils";

import UnlockIcon from "@/components/icons/unlock";
import LockIcon from "@/components/icons/lock";
import NoCheckIcon from "@/components/icons/noCheck";
import { ITask, TaskType } from "@/lib/types/task";

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
    setOpenPopover(false);
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
        open={openPopover}
        onOpenChange={(isOpen) => setOpenPopover(isOpen)}
      >
        <PopoverTrigger>
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
        </PopoverTrigger>
        <PopoverContent className="w-[360px]">
          <div className="w-[340px] rounded-md bg-white">
            <div className="flex flex-col">
              <div className="LabelText flex items-center">
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
        </PopoverContent>
      </Popover>
    );
  }

  const filterAccounts = [
    {
      address: "0x13131411231311131313131312321124241452334542342",
      eth: "0.0012",
      token: "0.0032",
      tag: 33,
    },
    {
      address: "0x13131412313113131313131312311241241452334542342",
      eth: "0.0012",
      token: "0.0032",
      tag: 33,
    },
    {
      address: "0x131314112313113131313113123211241241452334542342",
      eth: "0.0012",
      token: "0.0032",
      tag: 33,
    },
    {
      address: "0x13131411231313131311313123211241241452334542342",
      eth: "0.0012",
      token: "0.0032",
      tag: 33,
    },
    {
      address: "0x131341123131131313131313123211241241452334542342",
      eth: "0.0012",
      token: "0.0032",
      tag: 33,
    },
    {
      address: "0x131314112331131313131313123211241241452334542342",
      eth: "0.0012",
      token: "0.0032",
      tag: 33,
    },
    {
      address: "0x11314112313113131313131312321124124145233542342",
      eth: "0.0012",
      token: "0.0032",
      tag: 33,
    },
  ];

  const tasks: Array<ITask> = [
    {
      date: "2021-09-09 12:00:00",
      title: "TransferSEP",
      type: "Queued",
      address: "0x13131411231311131313131312321124241452334542342",
      gas: "0.0012",
      recipient: "0x13131411231311131313131312321124241452334542342",
      value: "0.0032",
      nonce: 3,
      direction: "USDT->IPI",
    },
    {
      date: "2021-09-09 12:00:00",
      title: "TransferSEP",
      type: "Pending",
      address: "0x13131411231311131313131312321124241452334542342",
      gas: "0.0012",
      recipient: "0x13131411231311131313131312321124241452334542342",
      value: "0.0032",
      nonce: 3,
      direction: "USDT->IPI",
    },
    {
      date: "2021-09-09 12:00:00",
      title: "TransferSEP",
      type: "Finished",
      address: "0x13131411231311131313131312321124241452334542342",
      gas: "0.0012",
      recipient: "0x13131411231311131313131312321124241452334542342",
      value: "0.0032",
      nonce: 3,
      direction: "USDT->IPI",
    },
    {
      date: "2021-09-09 12:00:00",
      title: "TransferSEP",
      type: "Failed",
      address: "0x13131411231311131313131312321124241452334542342",
      gas: "0.0012",
      recipient: "0x13131411231311131313131312321124241452334542342",
      value: "0.0032",
      nonce: 3,
      direction: "USDT->IPI",
    },
    {
      date: "2021-09-09 12:00:00",
      title: "TransferSEP",
      type: "Canceled",
      address: "0x13131411231311131313131312321124241452334542342",
      gas: "0.0012",
      recipient: "0x13131411231311131313131312321124241452334542342",
      value: "0.0032",
      nonce: 3,
      direction: "USDT->IPI",
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
          <div className="LabelText mb-1">Token</div>
          <div className="mb-3">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.name} value={token.name}>
                    {token.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center">
            <Input className="border-border-color bg-white" placeholder="Min" />
            <div className="mx-2">-</div>
            <Input className="border-border-color bg-white" placeholder="Max" />
          </div>
        </div>
        <div className="relative mt-8 flex flex-col border-t border-shadow-color pt-5">
          <button className="absolute top-[-20px] mx-3 flex w-[95%] items-center justify-center rounded border bg-white py-2 hover:bg-custom-bg-white">
            Filter Account
          </button>
          <div
            className="overflow-y-auto pb-2"
            style={{
              height: "calc(100vh - 413px)",
            }}
          >
            {filterAccounts.map((acc, index) => (
              <div
                key={acc.address}
                className="flex h-[73px] items-center justify-between border-b p-4"
              >
                <div className="self-start pl-2 pr-5 text-lg leading-none text-second-color">
                  {index + 1}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="text-lg font-medium text-title-color">
                    {displayText(acc.address)}
                  </div>
                  <div className="LabelText flex">
                    <div className="mr-6">ETH {acc.eth}</div>
                    <div>USDT {acc.token}</div>
                  </div>
                </div>
                <div className="rounded-full bg-[#e9eaee] px-3 text-sm">
                  {acc.tag}
                </div>
              </div>
            ))}
          </div>
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

  function SmallTokenCard({
    name,
    num,
    className,
  }: {
    name: string;
    num: number;
    className?: string;
  }) {
    return (
      <div
        className={cx(
          "flex flex-col rounded-md border bg-custom-bg-white px-4 py-2",
          className,
        )}
      >
        <div className="LabelText ">{name}</div>
        <div className="text-lg font-medium text-title-color">{num}</div>
      </div>
    );
  }

  function TokenSelectAndInput({ name }: { name: string }) {
    return (
      <div className="flex flex-col">
        <div className="LabelText mb-1">{name}</div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {tokens.map((token) => (
              <SelectItem key={token.name} value={token.name}>
                {token.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-2 h-3 border-l border-border-color" />
        <Input className="rounded-md border-border-color" placeholder="0" />
      </div>
    );
  }

  function AdvanceCollapsible() {
    const [open, setOpen] = useState(true);

    return (
      <Collapsible.Root
        className="mt-6 w-full"
        open={open}
        onOpenChange={setOpen}
      >
        <div className="mb-4 flex items-center pl-3">
          <div className="mr-3 text-xs font-medium text-title-color">
            Advance
          </div>
          <div className="h-[1px] flex-1 bg-shadow-color" />
          <Collapsible.Trigger asChild>
            <ChevronDownCircle
              className="mx-3 h-4 w-4 cursor-pointer text-second-color"
              style={{
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </Collapsible.Trigger>
          <div className="h-[1px] w-[10px] bg-shadow-color" />
        </div>

        <Collapsible.Content>
          <AdvanceContent />
        </Collapsible.Content>
      </Collapsible.Root>
    );
  }

  function AdvanceContent() {
    return (
      <div className="flex flex-col gap-y-3 px-3">
        <div className="flex justify-between gap-x-3">
          <div className="flex max-w-[150px] flex-col">
            <div className="LabelText mb-1">Timeout(s)</div>
            <Input className="rounded-md border-border-color" placeholder="0" />
          </div>
          <div className="flex flex-1 flex-col">
            <div className="LabelText mb-1">Slippage</div>
            <div className="relative">
              <Input
                className="rounded-md border-border-color"
                placeholder="0"
              />
              <div className="absolute right-2 top-[7px] select-none text-title-color">
                %
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-x-3">
          <div>
            <div className="LabelText mb-1">Nonce</div>
            <Input className="rounded-md border-border-color" placeholder="0" />
          </div>
          <div>
            <div className="LabelText mb-1">Gas(gwei)</div>
            <Input className="rounded-md border-border-color" placeholder="0" />
          </div>
          <button className="flex h-10 cursor-pointer items-center justify-center rounded-md border px-[11px] hover:bg-custom-bg-white">
            {Math.random() > 0.5 ? (
              <UnlockIcon className="text-[#999]" />
            ) : (
              <LockIcon className="text-primary" />
            )}
          </button>
          <button className="flex h-10 cursor-pointer items-center justify-center rounded-md border px-[11px] hover:bg-custom-bg-white">
            <NoCheckIcon
              className="text-primary"
              style={{
                color: Math.random() > 0.5 ? "#999" : "",
              }}
            />
          </button>
        </div>

        <div className="flex flex-col">
          <div className="LabelText mb-1">Schedule Time</div>
          <div className="flex justify-between gap-x-3">
            <Input className="bg-white"></Input>
            <button className="flex h-10 w-[92px] cursor-pointer items-center justify-center rounded-md border hover:bg-custom-bg-white">
              Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  function SecondCol() {
    return (
      <div className="flex h-full flex-1 flex-col justify-between border-r border-r-[#dadada]">
        <div className="flex flex-col">
          <div className="p-3">
            <div className="LabelText mb-1">OP</div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.name} value={token.name}>
                    {token.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 pt-0">
            <div className="LabelText mb-1">FromAddress</div>
            <div className="flex justify-between">
              <Input className="mr-3 border-border-color bg-white" />
              <button className="rounded-md border border-border-color bg-white px-6 font-bold text-title-color hover:bg-custom-bg-white">
                Query
              </button>
            </div>
          </div>

          <div className="mt-1 flex justify-between gap-x-3 px-3">
            <SmallTokenCard className="flex-1" name="ETH" num={0.001} />
            <SmallTokenCard className="flex-1" name="Token" num={0.001} />
            <SmallTokenCard className="flex-1" name="USDT" num={0.001} />
          </div>

          <div className="mt-3 flex items-center justify-between px-3">
            <TokenSelectAndInput name="Token0" />
            <ArrowBigRight
              className="mx-1 mt-1 h-5 w-5 text-[#7d8998]"
              style={{
                transform: "translateY(10px)",
              }}
            />
            <TokenSelectAndInput name="Token1" />
          </div>

          <AdvanceCollapsible />
        </div>

        <div
          className="flex items-center gap-x-3 border-t bg-white px-3 py-2"
          style={{
            boxShadow:
              "inset -1px 0px 0px 0px #D6D6D6,inset 0px 1px 0px 0px #D6D6D6",
          }}
        >
          <Button
            variant="outline"
            className="h-[40px] w-[120px] rounded-md border border-primary text-primary"
          >
            Test Tx
          </Button>
          <Button
            variant="outline"
            className="h-[40px] w-[120px] rounded-md border border-primary text-primary"
          >
            Schedule
          </Button>
        </div>
      </div>
    );
  }

  function TaskItemDetail({ task }: { task: Record<string, any> }) {
    return (
      <div className="flex flex-col gap-y-2 rounded-md border border-border-color bg-custom-bg-white p-3">
        <div className="flex justify-between text-second-color">
          <div>{task.date}</div>
          <div>[{task.title}]</div>
        </div>
        <div className="flex justify-between text-title-color">
          <div className="text-lg font-medium ">
            {displayText(task.address)}
          </div>
          <div>Gas: {task.gas}</div>
        </div>
        <div className="flex justify-between text-second-color">
          <div>Recipient: {displayText(task.recipient)}</div>
          <div>Value: {task.value}</div>
        </div>
        <div className="flex justify-between">
          <TaskTypeTag type={task.type} />
          <div>Nonce: {task.nonce}</div>
        </div>
      </div>
    );
  }

  function TaskTypeTag({ type }: { type: TaskType }) {
    const colorMap = {
      Queued: {
        color: "#0572ec",
        bg: "rgba(5, 114, 236, 0.1)",
        border: " rgba(5, 114, 236, 0.4);",
      },
      Pending: {
        color: "#EF814F",
        bg: "rgba(239, 129, 79, 0.1)",
        border: "rgba(239, 129, 79, 0.4)",
      },
      Finished: {
        color: "#07D498",
        bg: "rgba(7, 212, 152, 0.1)",
        border: "rgba(7, 212, 152, 0.4)",
      },
      Failed: {
        color: "#D42C1F",
        bg: "rgba(212, 44, 31, 0.1)",
        border: "rgba(212, 44, 31, 0.4)",
      },
      Canceled: {
        color: "#707070",
        bg: "#E9EAEE",
        border: "#bfbfbf",
      },
    };
    return (
      <div
        style={{
          color: colorMap[type].color,
          backgroundColor: colorMap[type].bg,
          border: `1px solid ${colorMap[type].border}`,
        }}
        className="rounded-full bg-[#e9eaee] px-3 text-sm"
      >
        {type}
      </div>
    );
  }

  function ThirdCol() {
    return (
      <div className="flex flex-1 flex-col">
        <div
          style={{
            boxShadow: "inset 0px -1px 0px 0px #D6D6D6",
          }}
          className="bg-custom-bg-white px-3 py-2"
        >
          <Input
            className="rounded-3xl bg-custom-bg-white"
            type="text"
            placeholder="Search"
          />
        </div>
        <div className="flex items-center justify-between gap-x-1 px-3 pb-8 pt-3">
          <Input className="bg-white"></Input>
          <div>-</div>
          <Input className="bg-white"></Input>
        </div>
        <div className="relative border-t pt-8">
          <button className="absolute top-[-20px] mx-3 flex w-[95%] items-center justify-center rounded border bg-white py-2 hover:bg-custom-bg-white">
            Filter Task
          </button>
          <div
            style={{
              height: "calc(100vh - 240px)",
            }}
            className="flex flex-col justify-stretch gap-y-3 overflow-y-auto px-3 pb-2"
          >
            {tasks.map((task) => (
              <TaskItemDetail key={task.address} task={task} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full items-stretch overflow-y-hidden bg-[#fafafa]">
      <FirstCol />
      <SecondCol />
      <ThirdCol />
    </div>
  );
}
