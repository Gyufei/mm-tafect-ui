import useSWR from "swr";
import useIndexStore from "../state";
import fetcher from "../fetcher";
import { format } from "date-fns";
import { useMemo } from "react";
import { isString } from "lodash";

export interface IPlanData {
  gas_price: {
    max_gas_price: string;
    is_avg: boolean;
  };
  kline_data: {
    high: IKlineItem;
    low: IKlineItem;
    mid: IKlineItem;
    up: boolean;
  };
  min_tx_span: string;
  trading_tx_data: IKlineItem;
  trading_vol_data: {
    data: IKlineItem;
    total: boolean;
  };
  plan_xyz: {
    base_sqrt_price_x96: string;
    sqrt_price_x96: string;
    x: string;
    y: string;
    z: string;
  };
}

interface IKlineItem {
  acc_value: string;
  is_random: boolean;
  max_value: string;
  min_value: string;
}

export interface IDayData {
  create_time: string;
  first_price: string;
  id: number;
  is_apply: boolean;
  is_locked: boolean;
  last_price: string;
  plan_info: IPlanData;
  pre_schedule_list: Array<IScheduleItem>;
  schedule_date: string;
  update_time: string;
  user_name: string;
}

interface IScheduleItem {
  amount: string;
  is_target_token: boolean;
}

export function useDashboardData(startDate: Date, endDate: Date) {
  const userPathMap = useIndexStore((state) => state.userPathMap());

  const res = useSWR(() => {
    if (!userPathMap || !userPathMap.scheduleList) return null;
    if (!startDate || !endDate) return null;

    const startStr = format(startDate, "yyyy-MM-dd");
    const endStr = format(endDate, "yyyy-MM-dd");

    return (
      userPathMap.scheduleList + `?from_date=${startStr}&to_date=${endStr}`
    );
  }, fetcher);

  const resData: Array<IDayData> = useMemo(() => {
    if (!res || !res.data) return null;

    const resOrigin = res.data;

    if (!resOrigin || !resOrigin.length) return [];

    const resMap = resOrigin.map(parseItem);

    return resMap;
  }, [res]);

  function parseItem(it: Record<string, any>) {
    it.plan_info = isString(it.plan_info)
      ? JSON.parse(it.plan_info)
      : it.plan_info;

    it.pre_schedule_list = isString(it.pre_schedule_list)
      ? JSON.parse(it.pre_schedule_list)
      : it.pre_schedule_list;
    return it;
  }

  return {
    ...res,
    data: resData,
  };
}
