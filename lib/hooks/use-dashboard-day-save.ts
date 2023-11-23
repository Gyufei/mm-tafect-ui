import { useState } from "react";
import useIndexStore from "../state";
import fetcher from "../fetcher";
import { format } from "date-fns";
import { useDashboardXYZ } from "./use-dashboard-xyz";
import { UpDownLabelOptions } from "../constants/dashboard-const";
import { toast } from "@/components/ui/use-toast";
import { IPlanData } from "./use-dashboard-data";

export function useDashboardDaySave() {
  const { getXYZ } = useDashboardXYZ();

  const userPathMap = useIndexStore((state) => state.userPathMap());
  const scheduleDate = useIndexStore((state) => state.selectedDay);

  const upOrDown = useIndexStore((state) => state.upOrDown);
  const topRandom = useIndexStore((state) => state.topRandom);
  const topValueAcc = useIndexStore((state) => state.topValueAcc);
  const topValueMin = useIndexStore((state) => state.topValueMin);
  const topValueMax = useIndexStore((state) => state.topValueMax);

  const bottomRandom = useIndexStore((state) => state.bottomRandom);
  const bottomValueAcc = useIndexStore((state) => state.bottomValueAcc);
  const bottomValueMin = useIndexStore((state) => state.bottomValueMin);
  const bottomValueMax = useIndexStore((state) => state.bottomValueMax);

  const rangeValueRandom = useIndexStore((state) => state.rangeValueRandom);
  const rangeValueAcc = useIndexStore((state) => state.rangeValueAcc);
  const rangeValueMin = useIndexStore((state) => state.rangeValueMin);
  const rangeValueMax = useIndexStore((state) => state.rangeValueMax);

  const totalTradingRandom = useIndexStore((state) => state.totalTradingRandom);
  const totalTradingVolumeMax = useIndexStore(
    (state) => state.totalTradingVolumeMax,
  );
  const totalTradingVolumeMin = useIndexStore(
    (state) => state.totalTradingVolumeMin,
  );
  const totalTradingVolumeAcc = useIndexStore(
    (state) => state.totalTradingVolumeAcc,
  );

  const tradingTxRandom = useIndexStore((state) => state.tradingTxRandom);
  const tradingTxMax = useIndexStore((state) => state.tradingTxMax);
  const tradingTxMin = useIndexStore((state) => state.tradingTxMin);
  const tradingTxAcc = useIndexStore((state) => state.tradingTxAcc);

  const isAvgGas = useIndexStore((state) => state.isAvgGas);
  const gasValue = useIndexStore((state) => state.gasValue);

  const minTxSpanValue = useIndexStore((state) => state.minTxSpanValue);
  const minTxSpanUnit = useIndexStore((state) => state.minTxSpanUnit);

  const [saveLoading, setSaveLoading] = useState(false);

  const getSaveParams = async () => {
    const xyzData = await getXYZ();
    if (!xyzData) return null;

    const minTxSpan = String(Number(minTxSpanValue) * Number(minTxSpanUnit));
    const gasWeiVal = String(Number(gasValue) * 10 ** 9);
    const defVal = "0";

    const params: IPlanData = {
      gas_price: {
        max_gas_price: gasWeiVal,
        is_avg: isAvgGas,
      },
      kline_data: {
        high: {
          is_random: topRandom,
          acc_value: !topRandom ? topValueAcc : defVal,
          max_value: topRandom ? topValueMax : defVal,
          min_value: topRandom ? topValueMin : defVal,
        },
        low: {
          is_random: bottomRandom,
          acc_value: !bottomRandom ? bottomValueAcc : defVal,
          max_value: bottomRandom ? bottomValueMax : defVal,
          min_value: bottomRandom ? bottomValueMin : defVal,
        },
        mid: {
          is_random: rangeValueRandom,
          acc_value: !rangeValueRandom ? rangeValueAcc : defVal,
          max_value: rangeValueRandom ? rangeValueMax : defVal,
          min_value: rangeValueRandom ? rangeValueMin : defVal,
        },
        up: upOrDown === UpDownLabelOptions[0],
      },
      min_tx_span: minTxSpan,
      trading_tx_data: {
        is_random: tradingTxRandom,
        acc_value: !tradingTxRandom ? tradingTxAcc : defVal,
        max_value: tradingTxRandom ? tradingTxMax : defVal,
        min_value: tradingTxRandom ? tradingTxMin : defVal,
      },
      trading_vol_data: {
        data: {
          is_random: totalTradingRandom,
          acc_value: !totalTradingRandom ? totalTradingVolumeAcc : defVal,
          max_value: totalTradingRandom ? totalTradingVolumeMax : defVal,
          min_value: totalTradingRandom ? totalTradingVolumeMin : defVal,
        },
        total: true,
      },
      plan_xyz: {
        ...xyzData,
      },
    };

    return params;
  };

  const saveAction = async () => {
    const date = format(scheduleDate, "yyyy-MM-dd");
    const saveUrl = userPathMap.scheduleSave + `?schedule_date=${date}`;

    const params = await getSaveParams();
    if (!saveUrl || !params) return;
    setSaveLoading(true);

    const res = await fetcher(saveUrl, {
      method: "POST",
      body: JSON.stringify(params),
    });

    const isFailed = res.msg.includes("Failed");
    toast({
      variant: isFailed ? "destructive" : "default",
      title: res.msg,
    });

    setSaveLoading(false);

    return res;
  };

  return {
    saveLoading,
    saveAction,
  };
}
