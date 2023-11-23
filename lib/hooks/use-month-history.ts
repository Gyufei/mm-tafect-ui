import { endOfDay, startOfDay } from "date-fns";
import { useParseTasks } from "./use-parse-task";
import { ITask } from "../types/task";
import fetcher from "../fetcher";
import useIndexStore from "../state";
import useSWR from "swr";

export function useMonthHistory(startDate: Date, endDate: Date) {
  const userPathMap = useIndexStore((state) => state.userPathMap());
  const { parsedTaskFunc, isCanParse } = useParseTasks();

  const getQueryStr = () => {
    let max = startOfDay(startDate).getTime();
    let min = endOfDay(endDate).getTime();
    if (max < min) {
      [max, min] = [min, max];
    }
    return `execute_time_maximum=${max}&execute_time_minimum=${min}`;
  };

  const fetchTasks = async (url: string): Promise<Array<ITask> | undefined> => {
    if (!startDate || !endDate) return undefined;
    if (!isCanParse) {
      return undefined;
    }

    const taskRes: Array<Record<string, any>> = await fetcher(url);

    if (!taskRes) return undefined;

    const parsed = parsedTaskFunc(taskRes);

    return parsed;
  };

  const res = useSWR(() => {
    if (!startDate || !endDate) return null;
    if (!isCanParse) return null;

    return `${userPathMap.swapHistory}?${getQueryStr()}`;
  }, fetchTasks);

  return res;
}
