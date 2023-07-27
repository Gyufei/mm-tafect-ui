"use client";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { uniqBy } from "lodash";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowBigRight,
  ChevronDownCircle,
  ChevronDown,
  Loader2,
} from "lucide-react";

import { DateTimePickerInput } from "react-datetime-range-super-picker";
import "react-datetime-range-super-picker/dist/index.css";
import "./index.css";

import { Checkbox } from "@/components/ui/checkbox";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, displayText } from "@/lib/utils";

import DetailItem from "@/components/shared/detail-item";
import NetworkSelect from "@/components/shared/network-select/network-select";
import UnlockIcon from "@/components/icons/unlock";
import LockIcon from "@/components/icons/lock";
import NoCheckIcon from "@/components/icons/noCheck";

import { ITask, TaskType } from "@/lib/types/task";
import fetcher from "@/lib/fetcher";
import { PathMap } from "@/lib/path-map";
import {
  KeyStoreAccount,
  useKeyStoreAccounts,
} from "@/lib/hooks/use-key-store-accounts";

import { useStrNum } from "@/lib/hooks/use-str-num";
import FilterAccountList from "@/components/token-swap/filter-account-list";

export default function TokenSwap() {
  const [currentNetwork, setCurrentNetwork] = useState(11155111);
  const [selectedToken, setSelectedToken] = useState<string>();
  const [openKeyStorePop, setKeyStorePop] = useState(false);
  const [selectedKeyStores, setSelectedKeyStore] = useState<
    Array<KeyStoreAccount>
  >([]);

  const keyStoreOptions = useKeyStoreAccounts(currentNetwork);

  useEffect(() => {
    if (!selectedKeyStores.length && keyStoreOptions.length) {
      setSelectedKeyStore([keyStoreOptions[0]]);
    }
  }, [keyStoreOptions]);

  const handleSelectNetwork = (networkOption: any) => {
    if (networkOption.id === currentNetwork) {
      filterResultReset();
      setSelectedToken("");
      setTokenMax("");
      setTokenMin("");
    }
    setCurrentNetwork(networkOption.id);
  };

  const handleSelectKeyStore = (keyStore: any) => {
    setSelectedKeyStore((ks) => {
      if (ks.some((k) => k.name === keyStore.name)) {
        return ks.filter((k) => k.name !== keyStore.name);
      } else {
        return [...ks, keyStore];
      }
    });
    setKeyStorePop(false);
  };

  const { data: tokens } = useSWR(
    `${PathMap.tokenList}?chain_id=${currentNetwork}`,
    fetcher,
  );

  const uniqueTokens = useMemo(() => {
    return uniqBy(tokens, "address") as any;
  }, [tokens]);

  const [tokenMin, setTokenMin] = useStrNum("");
  const [tokenMax, setTokenMax] = useStrNum("");

  const {
    data: filteredAccounts,
    isMutating: filtering,
    trigger: filterTrigger,
    reset: filterResultReset,
  } = useSWRMutation(
    () => `${PathMap.filterAccount}?${getFilterQuery()}`,
    fetcher as any,
  );

  useEffect(() => {}, [currentNetwork]);

  function getFilterQuery() {
    const queryParams = new URLSearchParams();

    if (currentNetwork) {
      queryParams.set("chain_id", currentNetwork.toString());
    }

    if (selectedKeyStores.length) {
      queryParams.set(
        "keystore",
        selectedKeyStores.map((ks) => ks.name).join(","),
      );
    }

    if (tokenMin) {
      queryParams.set("token_amount_minimum", tokenMin.toString());
    }

    if (tokenMax) {
      queryParams.set("token_amount_maximum", tokenMax.toString());
    }

    if (selectedToken) {
      queryParams.set("token_address", selectedToken);
    }

    const query = queryParams.toString();

    return query;
  }

  const [date, setDate] = useState<Date>();
  const [scheduledDateTime, setScheduledDateTime] = useState(new Date());
  const handleDateUpdate = ({ date }: any) => {
    setScheduledDateTime(date.date);
  };

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
        className={cn(
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
      <div className="flex flex-1 flex-col">
        <div className="LabelText mb-1">{name}</div>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {(uniqueTokens || []).map((token: Record<string, string>) => (
              <SelectItem key={token.name} value={token.address}>
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
      <Collapsible className="mt-6 w-full" open={open} onOpenChange={setOpen}>
        <div className="mb-4 flex items-center pl-3">
          <div className="mr-3 text-xs font-medium text-title-color">
            Advance
          </div>
          <div className="h-[1px] flex-1 bg-shadow-color" />
          <CollapsibleTrigger asChild>
            <ChevronDownCircle
              className="mx-3 h-4 w-4 cursor-pointer text-content-color"
              style={{
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </CollapsibleTrigger>
          <div className="h-[1px] w-[10px] bg-shadow-color" />
        </div>

        <CollapsibleContent>
          <AdvanceContent />
        </CollapsibleContent>
      </Collapsible>
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
                color: "#999",
              }}
            />
          </button>
        </div>

        <div className="flex flex-col">
          <div className="LabelText mb-1">Schedule Time</div>
          <div className="flex justify-between gap-x-3">
            <DateTimePickerInput
              date={scheduledDateTime}
              onDateTimeUpdate={(e) => handleDateUpdate(e)}
              colors={
                {
                  primary_highlight_color: "#707070",
                  secondary_highlight_color: "#333",
                } as any
              }
              format="YYY-MM-dd HH:mm"
              timeFormat="HH:mm"
              dateFormat="YYY-MM-dd"
              weekStartsOn={0}
            />
            <button className="flex h-10 w-[92px] cursor-pointer items-center justify-center rounded-md border hover:bg-custom-bg-white">
              Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [selectedOp, setSelectedOp] = useState<Record<string, any> | null>(
    null,
  );

  const handleSelectOP = (opId: string) => {
    const op = opList.find((op: Record<string, any>) => op.id === opId);
    setSelectedOp(op);
  };

  const { data: opList } = useSWR(
    `${PathMap.ops}?chain_id=${currentNetwork}`,
    fetcher,
  );

  const [queryAccount, setQueryAccount] = useState<string>("");

  function handleQueryAccount() {}

  function SecondCol() {
    return (
      <div className="flex h-full flex-1 flex-col justify-between border-r border-r-[#dadada]">
        <div className="flex flex-col">
          <div className="p-3">
            <div className="LabelText mb-1">OP</div>
            <Select
              value={selectedOp?.id}
              onValueChange={(e) => handleSelectOP(e)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select OP" />
              </SelectTrigger>
              <SelectContent>
                {(opList || []).map((op: Record<string, string>) => (
                  <SelectItem key={op.id} value={op.id}>
                    {op.op_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 pt-0">
            <div className="LabelText mb-1">FromAddress</div>
            <div className="flex justify-between">
              <Input
                value={queryAccount}
                onChange={(e) => setQueryAccount(e.target.value)}
                className="mr-3 border-border-color bg-white"
                placeholder="0x11111111111"
              />
              <button
                onClick={() => handleQueryAccount()}
                className="rounded-md border border-border-color bg-white px-6 font-bold text-title-color hover:bg-custom-bg-white"
              >
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
                  !date && "text-muted-foreground",
                )}
              >
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
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
                  !date && "text-muted-foreground",
                )}
              >
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
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
              value={currentNetwork}
              onSelect={(e) => handleSelectNetwork(e)}
            />
          </DetailItem>
          <DetailItem title="KeyStore">
            <Popover
              open={openKeyStorePop}
              onOpenChange={(isOpen) => setKeyStorePop(isOpen)}
            >
              <PopoverTrigger className="w-[350px]">
                <div
                  className="flex items-center transition-all duration-75 active:bg-gray-100"
                  onClick={() => setKeyStorePop(!openKeyStorePop)}
                >
                  {selectedKeyStores.length ? (
                    <>
                      <div className="mr-2 text-title-color">
                        {selectedKeyStores[0].name}
                      </div>
                      <div className="Tag mr-2 bg-[#e9eaee]">
                        {selectedKeyStores.length}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-content-color">
                      Select KeyStore
                    </div>
                  )}
                  <ChevronDown
                    className={`h-4 w-4 text-gray-600 transition-all ${
                      openKeyStorePop ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[360px]" align="start">
                <div className="w-[340px] rounded-md bg-white">
                  <div className="flex flex-col">
                    <div className="LabelText mb-1 flex items-center">
                      Available KeyStores
                    </div>
                    <div className="flex flex-wrap">
                      {keyStoreOptions.map((option) => (
                        <div
                          key={option.name}
                          className="flex w-[160px] cursor-pointer items-center"
                        >
                          <Checkbox
                            id={option.name}
                            checked={selectedKeyStores.some(
                              (ks) => ks.name === option.name,
                            )}
                            onCheckedChange={() => handleSelectKeyStore(option)}
                          />
                          <label
                            className="flex cursor-pointer items-center pl-2 text-lg font-medium text-title-color"
                            htmlFor={option.name}
                          >
                            {option.name}
                            <div className="Tag ml-2 bg-[#e9eaee]">
                              {option.accounts.length}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </DetailItem>
        </div>

        <div className="flex flex-col justify-stretch">
          <div className="flex flex-col px-4">
            <div className="LabelText mb-1">Token</div>
            <div className="mb-3">
              <Select
                value={selectedToken}
                onValueChange={(e) => setSelectedToken(e)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Token" />
                </SelectTrigger>
                <SelectContent>
                  {(uniqueTokens || []).map((token: Record<string, string>) => (
                    <SelectItem key={token.name} value={token.address}>
                      {token.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <Input
                value={tokenMin}
                onChange={(e) => setTokenMin(e.target.value)}
                className="border-border-color bg-white"
                placeholder="Min"
              />
              <div className="mx-2">-</div>
              <Input
                value={tokenMax}
                onChange={(e) => setTokenMax(e.target.value)}
                className="border-border-color bg-white"
                placeholder="Max"
              />
            </div>
          </div>
          <div className="relative mt-8 flex flex-col border-t border-shadow-color pt-5">
            <Button
              disabled={filtering}
              onClick={() => filterTrigger()}
              className="disabled:opacity-1 absolute top-[-20px] mx-3 flex w-[95%] items-center justify-center rounded border bg-white py-2 hover:bg-custom-bg-white"
            >
              {filtering && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
              )}
              <span className="text-title-color">Filter Account</span>
            </Button>
            <FilterAccountList accounts={filteredAccounts} />
          </div>
        </div>
      </div>

      <SecondCol />
      <ThirdCol />
    </>
  );
}
