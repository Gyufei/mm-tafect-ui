import { useMemo, useState } from "react";
import { differenceInCalendarDays, format } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { ITask } from "@/lib/types/task";
import { PathMap } from "@/lib/path-map";
import useSWRMutation from "swr/mutation";
import fetcher from "@/lib/fetcher";
import Empty from "../shared/empty";
import useSWR from "swr";
import { IToken } from "@/lib/types/token";
import { useTokens } from "@/lib/hooks/use-tokens";
import SwapHistoryItem from "./swap-history-item";
import LoadingIcon from "../shared/loading-icon";

export default function SwapHistory({
  networkId,
}: {
  networkId: string | null;
}) {
  const { data: opList } = useSWR(() => {
    return networkId ? `${PathMap.ops}?chain_id=${networkId}` : null;
  }, fetcher);
  const { data: tokens }: { data: Array<IToken> } = useTokens(networkId);

  const [filterTaskDate, setFilterTaskDate] = useState<{
    min: Date | null;
    max: Date | null;
  }>({
    // min: null,
    // max: null,
    min: new Date("2023-07-01"),
    max: new Date("2023-07-31"),
  });

  const [openMinPopover, setOpenMinPopover] = useState(false);
  const [openMaxPopover, setOpenMaxPopover] = useState(false);

  const handleMinDateChange = (d: Date | undefined) => {
    setFilterTaskDate((prev) => ({
      ...prev,
      min: d || null,
    }));
    setOpenMinPopover(false);
  };

  const handleMaxDateChange = (d: Date | undefined) => {
    setFilterTaskDate((prev) => ({
      ...prev,
      max: d || null,
    }));
    setOpenMaxPopover(false);
  };

  const disabledDate = (date: Date) => {
    return differenceInCalendarDays(date, new Date()) > 0;
  };

  const getQueryStr = () => {
    let max = new Date(filterTaskDate.max || "").getTime();
    let min = new Date(filterTaskDate.min || "").getTime();
    if (max < min) {
      [max, min] = [min, max];
    }
    return `execute_time_maximum=${max}&execute_time_minimum=${min}`;
  };

  const fetchTasks = async (url: string): Promise<Array<ITask> | undefined> => {
    const taskRes = await fetcher(url);
    if (!taskRes) return undefined;

    const parsed = taskRes
      .map((t: Record<string, any>) => {
        const data = JSON.parse(t.data);
        const date = format(new Date(t.create_time), "YYY-MM-dd HH:mm");

        const opType = opList.find((op: Record<string, any>) => {
          return op.op_id === t.op;
        }).op_name;

        if (t.op === 1) {
          data.tokenInName = tokens.find(
            (tk) => tk.address === data.token_in,
          )?.symbol;
          data.tokenOutName = tokens.find(
            (tk) => tk.address === data.token_out,
          )?.symbol;
        }

        if (t.op === 3) {
          data.tokenName =
            tokens.find((tk) => tk.address === data.token)?.symbol || "";
        }

        return {
          id: t.id,
          account: t.account,
          status: t.status,
          txHash: t.tx_hash,
          op: t.op,
          opName: opType,
          date,
          data,
        };
      })
      .filter((t) => t.op === 1);

    console.log(parsed);
    return parsed;
  };

  const {
    data: tasks,
    trigger: filterTrigger,
    isMutating: filtering,
  }: {
    data: Array<any> | undefined;
    trigger: any;
    isMutating: boolean;
  } = useSWRMutation(`${PathMap.swapHistory}?${getQueryStr()}`, fetchTasks);

  const handleSearch = () => {
    if (!filterTaskDate.min && !filterTaskDate.max) {
      return null;
    } else {
      filterTrigger();
    }
  };

  return (
    <>
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
        <Popover
          open={openMinPopover}
          onOpenChange={(isOpen) => setOpenMinPopover(isOpen)}
        >
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !filterTaskDate.min && "text-muted-foreground",
              )}
            >
              {filterTaskDate.min ? (
                format(filterTaskDate.min, "YYY-MM-dd")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filterTaskDate.min || undefined}
              onSelect={(e) => handleMinDateChange(e)}
              disabled={disabledDate}
            />
          </PopoverContent>
        </Popover>
        <div>-</div>
        <Popover
          open={openMaxPopover}
          onOpenChange={(isOpen) => setOpenMaxPopover(isOpen)}
        >
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !filterTaskDate.max && "text-muted-foreground",
              )}
            >
              {filterTaskDate.max ? (
                format(filterTaskDate.max, "YYY-MM-dd")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filterTaskDate.max || undefined}
              onSelect={(e) => handleMaxDateChange(e)}
              disabled={disabledDate}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="relative border-t pt-8">
        <Button
          disabled={filtering}
          onClick={() => handleSearch()}
          className="disabled:opacity-1 absolute top-[-20px] mx-3 flex w-[95%] items-center justify-center rounded border bg-white py-2 text-title-color hover:bg-custom-bg-white"
        >
          <LoadingIcon isLoading={filtering} />
          Filter Task
        </Button>
        <div
          style={{
            height: "calc(100vh - 240px)",
          }}
          className="flex flex-col justify-stretch gap-y-3 overflow-y-auto px-3 pb-2"
        >
          {tasks?.length ? (
            tasks.map((task) => <SwapHistoryItem key={task.id} task={task} />)
          ) : Array.isArray(tasks) ? (
            <Empty />
          ) : null}
        </div>
      </div>
    </>
  );
}
