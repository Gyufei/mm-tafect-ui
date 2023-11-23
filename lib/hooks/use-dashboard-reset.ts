import useIndexStore from "../state";

export function useDashboardReset() {
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

  const resetAction = () => {
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
  };

  return {
    resetAction,
  };
}
