"use client";
import { format } from "date-fns";
import { useState } from "react";

import "./index.css";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, displayText } from "@/lib/utils";

import DetailItem from "@/components/shared/detail-item";
import NetworkSelect from "@/components/shared/network-select/network-select";

import { ITask, TaskType } from "@/lib/types/task";
import { IKeyStoreAccount } from "@/lib/hooks/use-key-store-accounts";

import FilterAccountList from "@/components/token-swap/filter-account-list";
import KeyStoreSelect from "@/components/token-swap/key-store-select";
import { INetwork } from "@/lib/types/network";
import { IToken } from "@/lib/types/token";
import Op from "@/components/token-swap/op";

export default function TokenSwap() {
  const [currentNetwork, setCurrentNetwork] = useState<INetwork | null>(null);
  const [selectedToken, setSelectedToken] = useState<IToken | null>(null);
  const [selectedKeyStores, setSelectedKeyStore] = useState<
    Array<IKeyStoreAccount>
  >([]);

  const [filterTaskDate, setFilterTaskDate] = useState<Date>();

  const [queryAccount, setQueryAccount] = useState<string>("");

  const tasks: Array<ITask> = [
    {
      date: "2021-09-09 12:00:00",
      title: "TransferSEP",
      type: "Queued",
      address: "0x131314112131113131311312321124241452334542342",
      gas: "0.0012",
      recipient: "0x13131411231311131313131312321124241452334542342",
      value: "0.0032",
      nonce: 3,
      direction: "USDT->IPI",
    },
  ];

  function TaskItemDetail({ task }: { task: Record<string, any> }) {
    return (
      <div className="flex flex-col gap-y-2 rounded-md border border-border-color bg-custom-bg-white p-3">
        <div className="flex justify-between text-content-color">
          <div>{task.date}</div>
          <div>[{task.title}]</div>
        </div>
        <div className="flex justify-between text-title-color">
          <div className="text-lg font-medium ">
            {displayText(task.address)}
          </div>
          <div>Gas: {task.gas}</div>
        </div>
        <div className="flex justify-between text-content-color">
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
        border: " rgba(5, 114, 236, 0.4)",
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !filterTaskDate && "text-muted-foreground",
                )}
              >
                {filterTaskDate ? (
                  format(filterTaskDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filterTaskDate}
                onSelect={setFilterTaskDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <div>-</div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !filterTaskDate && "text-muted-foreground",
                )}
              >
                {filterTaskDate ? (
                  format(filterTaskDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filterTaskDate}
                onSelect={setFilterTaskDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
    <>
      <div className="h-full flex-1 border-r border-r-[#dadada]">
        <div className="flex flex-col p-4">
          <DetailItem title="Network">
            <NetworkSelect
              value={currentNetwork || null}
              onSelect={(net: INetwork | null) => setCurrentNetwork(net)}
            />
          </DetailItem>
          <DetailItem title="KeyStore">
            <KeyStoreSelect
              networkId={currentNetwork?.chain_id || null}
              keyStores={selectedKeyStores}
              handleKeystoreSelect={(e) => setSelectedKeyStore(e)}
            />
          </DetailItem>
        </div>

        <FilterAccountList
          token={selectedToken}
          handleTokenSelect={(e) => setSelectedToken(e)}
          networkId={currentNetwork?.chain_id || null}
          keyStores={selectedKeyStores}
        ></FilterAccountList>
      </div>

      <Op
        token={selectedToken}
        network={currentNetwork}
        queryAccount={queryAccount}
        handleQueryAccountChange={setQueryAccount}
      />
      <ThirdCol />
    </>
  );
}
