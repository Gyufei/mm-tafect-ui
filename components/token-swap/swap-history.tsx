import { useContext, useMemo, useState } from "react";
import { setHours, setMinutes, setSeconds, format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ITask } from "@/lib/types/task";
import { PathMap } from "@/lib/path-map";
import useSWRMutation from "swr/mutation";
import fetcher from "@/lib/fetcher";
import Empty from "../shared/empty";
import useSWR from "swr";
import SwapHistoryItem from "./swap-history-item";
import LoadingIcon from "../shared/loading-icon";
import { Web3Context } from "@/lib/providers/web3-provider";
import { DatePicker } from "@mui/x-date-pickers";

export default function SwapHistory() {
  const { tokens, network } = useContext(Web3Context);
  const networkId = network?.chain_id || null;

  const { data: opList } = useSWR(() => {
    return networkId ? `${PathMap.ops}?chain_id=${networkId}` : null;
  }, fetcher);

  const [filterTaskDate, setFilterTaskDate] = useState<{
    min: Date | null;
    max: Date | null;
  }>({
    min: null,
    max: null,
  });

  const handleMinDateChange = (d: Date | null) => {
    setFilterTaskDate((prev) => ({
      ...prev,
      min: d,
    }));
  };

  const handleMaxDateChange = (d: Date | null) => {
    const date = d ? setHours(setMinutes(setSeconds(d, 59), 59), 23) : null;

    setFilterTaskDate((prev) => ({
      ...prev,
      max: date,
    }));
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

    const parsed = taskRes.map((t: Record<string, any>) => {
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
    });

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

  const [searchText, setSearchText] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks?.filter((task) => {
      if (searchText === "") {
        return true;
      } else {
        const isTxHash = task.txHash.includes(searchText);
        const isAccount = task.account.includes(searchText);
        return isTxHash || isAccount;
      }
    });
  }, [tasks, searchText]);

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
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="rounded-3xl bg-custom-bg-white"
          type="text"
          placeholder="Search"
        />
      </div>
      <div className="flex items-center justify-between gap-x-1 px-3 pb-8 pt-3">
        <DatePicker
          slotProps={{ textField: { size: "small", fullWidth: true } }}
          value={filterTaskDate.min}
          onChange={(e) => handleMinDateChange(e)}
        />
        <div>-</div>
        <DatePicker
          slotProps={{ textField: { size: "small", fullWidth: true } }}
          value={filterTaskDate.max}
          onChange={(e) => handleMaxDateChange(e)}
        />
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
            height: "calc(100vh - 245px)",
          }}
          className="flex flex-col justify-stretch gap-y-3 overflow-y-auto px-3 pb-2"
        >
          {filteredTasks?.length ? (
            filteredTasks.map((task) => (
              <SwapHistoryItem key={task.id} task={task} />
            ))
          ) : Array.isArray(tasks) ? (
            <Empty />
          ) : null}
        </div>
      </div>
    </>
  );
}