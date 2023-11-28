import { UpDownLabelOptions } from "../constants/dashboard-const";
import useIndexStore from "../state";
import { IPlanData } from "./use-dashboard-data";

export function useDashboardReset() {
  const setUpOrDown = useIndexStore((state) => state.setUpOrDown);
  const setBottomRandom = useIndexStore((state) => state.setBottomRandom);
  const setBottomValueMin = useIndexStore((state) => state.setBottomValueMin);
  const setBottomValueMax = useIndexStore((state) => state.setBottomValueMax);
  const setBottomValueAcc = useIndexStore((state) => state.setBottomValueAcc);

  const setTopRandom = useIndexStore((state) => state.setTopRandom);
  const setTopValueMin = useIndexStore((state) => state.setTopValueMin);
  const setTopValueMax = useIndexStore((state) => state.setTopValueMax);
  const setTopValueAcc = useIndexStore((state) => state.setTopValueAcc);

  const setMidRandom = useIndexStore((state) => state.setRangeValueRandom);
  const setMidValueMin = useIndexStore((state) => state.setRangeValueMin);
  const setMidValueMax = useIndexStore((state) => state.setRangeValueMax);
  const setMidValueAcc = useIndexStore((state) => state.setRangeValueAcc);

  const setTotalTradingRandom = useIndexStore(
    (state) => state.setTotalTradingRandom,
  );
  const setTotalTradingVolumeAcc = useIndexStore(
    (state) => state.setTotalTradingVolumeAcc,
  );
  const setTotalTradingVolumeMax = useIndexStore(
    (state) => state.setTotalTradingVolumeMax,
  );
  const setTotalTradingVolumeMin = useIndexStore(
    (state) => state.setTotalTradingVolumeMin,
  );

  const setTradingTxRandom = useIndexStore((state) => state.setTradingTxRandom);
  const setTradingTxAcc = useIndexStore((state) => state.setTradingTxAcc);
  const setTradingTxMax = useIndexStore((state) => state.setTradingTxMax);
  const setTradingTxMin = useIndexStore((state) => state.setTradingTxMin);

  const setIsAvgGas = useIndexStore((state) => state.setIsAvgGas);
  const setGasValue = useIndexStore((state) => state.setGasValue);

  const setMinTxSpanValue = useIndexStore((state) => state.setMinTxSpanValue);
  const setMinTxSpanUnit = useIndexStore((state) => state.setMinTxSpanUnit);

  const resetAction = (initData?: IPlanData) => {
    if (!initData) {
      setUpOrDown(UpDownLabelOptions[0]);

      setBottomRandom(true);
      setBottomValueMin("");
      setBottomValueMax("");
      setBottomValueAcc("");

      setTopRandom(true);
      setTopValueMin("");
      setTopValueMax("");
      setTopValueAcc("");

      setMidRandom(true);
      setMidValueMin("");
      setMidValueMax("");
      setMidValueAcc("");

      setTotalTradingRandom(true);
      setTotalTradingVolumeAcc("");
      setTotalTradingVolumeMax("");
      setTotalTradingVolumeMin("");

      setTradingTxRandom(true);
      setTradingTxAcc("");
      setTradingTxMax("");
      setTradingTxMin("");

      setIsAvgGas(false);
      setGasValue("");

      setMinTxSpanValue("");
      setMinTxSpanUnit("");
    } else {
      const {
        kline_data,
        min_tx_span,
        gas_price,
        trading_tx_data,
        trading_vol_data,
      } = initData;
      const { low, mid, high, up } = kline_data;

      setUpOrDown(up ? UpDownLabelOptions[0] : UpDownLabelOptions[1]);
      setBottomRandom(low.is_random);
      setBottomValueMin(low.min_value);
      setBottomValueMax(low.max_value);
      setBottomValueAcc(low.acc_value);

      setTopRandom(high.is_random);
      setTopValueMin(high.min_value);
      setTopValueMax(high.max_value);
      setTopValueAcc(high.acc_value);

      setMidRandom(mid.is_random);
      setMidValueMin(mid.min_value);
      setMidValueMax(mid.max_value);
      setMidValueAcc(mid.acc_value);

      setTotalTradingRandom(trading_vol_data.data.is_random);
      setTotalTradingVolumeAcc(trading_vol_data.data.acc_value);
      setTotalTradingVolumeMax(trading_vol_data.data.max_value);
      setTotalTradingVolumeMin(trading_vol_data.data.min_value);

      setTradingTxRandom(trading_tx_data.is_random);
      setTradingTxAcc(trading_tx_data.acc_value);
      setTradingTxMax(trading_tx_data.max_value);
      setTradingTxMin(trading_tx_data.min_value);

      const gWeiGas = String(Number(gas_price.max_gas_price) / 10 ** 9);
      setIsAvgGas(gas_price.is_avg);
      setGasValue(gWeiGas);

      const minSpanNum = Number(min_tx_span);
      if (minSpanNum > 60 * 60) {
        const hours = minSpanNum / 60 / 60;
        setMinTxSpanValue(String(hours));
        setMinTxSpanUnit(String(3600));
      } else if (minSpanNum > 60) {
        const minutes = minSpanNum / 60;
        setMinTxSpanValue(String(minutes));
        setMinTxSpanUnit(String(60));
      } else {
        setMinTxSpanValue(min_tx_span);
        setMinTxSpanUnit(String(1));
      }
    }
  };

  return {
    resetAction,
  };
}
