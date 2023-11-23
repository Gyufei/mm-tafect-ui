import useIndexStore from "../state";
import fetcher from "../fetcher";
import { useContext } from "react";
import { NetworkContext } from "../providers/network-provider";
import { UpDownLabelOptions } from "../constants/dashboard-const";
import { IPlanData } from "./use-dashboard-data";

export function useDashboardXYZ() {
  const { network } = useContext(NetworkContext);
  const chainId = network?.chain_id || "";
  const userPathMap = useIndexStore((state) => state.userPathMap());

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

  const getParams = () => {
    if (topRandom && !topValueMax && !topValueMin) return null;
    if (bottomRandom && !bottomValueMax && !bottomValueMin) return null;
    if (rangeValueRandom && !rangeValueMax && !rangeValueMin) return null;
    if (!topRandom && !topValueAcc) return null;
    if (!bottomRandom && !bottomValueAcc) return null;
    if (!rangeValueRandom && !rangeValueAcc) return null;

    const defVal = "0";

    const params: IPlanData["kline_data"] = {
      up: upOrDown === UpDownLabelOptions[0],
      high: {
        is_random: topRandom,
        max_value: topRandom ? topValueMax : defVal,
        min_value: topRandom ? topValueMin : defVal,
        acc_value: !topRandom ? topValueAcc : defVal,
      },
      mid: {
        is_random: rangeValueRandom,
        max_value: rangeValueRandom ? rangeValueMax : defVal,
        min_value: rangeValueRandom ? rangeValueMin : defVal,
        acc_value: !rangeValueRandom ? rangeValueAcc : defVal,
      },
      low: {
        is_random: bottomRandom,
        max_value: bottomRandom ? bottomValueMax : defVal,
        min_value: bottomRandom ? bottomValueMin : defVal,
        acc_value: !bottomRandom ? bottomValueAcc : defVal,
      },
    };

    return params;
  };

  const getXYZ = async () => {
    const getUrl = `${userPathMap.scheduleXYZ}?chain_id=${chainId}`;
    const params = getParams();
    if (!getUrl || !params) return;

    const res = await fetcher(getUrl, {
      method: "POST",
      body: JSON.stringify(params),
    });

    return res;
  };

  return {
    getXYZ,
  };
}
