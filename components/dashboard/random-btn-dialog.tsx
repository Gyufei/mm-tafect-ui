import useIndexStore from "@/lib/state";
import RandomInputDialog from "./random-input-dialog";

export default function RandomBtnDialog({
  up,
}: {
  up: "top" | "bottom" | "mid";
}) {
  if (up === "mid") return <MidValueDialog />;
  else if (up === "top") return <TopRandomDialog />;
  else if (up === "bottom") return <BottomRandomDialog />;
  else return null;
}

function TopRandomDialog() {
  const topRandom = useIndexStore((state) => state.topRandom);
  const setTopRandom = useIndexStore((state) => state.setTopRandom);
  const topValueMin = useIndexStore((state) => state.topValueMin);
  const setTopValueMin = useIndexStore((state) => state.setTopValueMin);
  const topValueMax = useIndexStore((state) => state.topValueMax);
  const setTopValueMax = useIndexStore((state) => state.setTopValueMax);
  const topValueAcc = useIndexStore((state) => state.topValueAcc);
  const setTopValueAcc = useIndexStore((state) => state.setTopValueAcc);

  return (
    <RandomInputDialog
      isRandom={topRandom}
      minValue={topValueMin}
      maxValue={topValueMax}
      setIsRandom={setTopRandom}
      setMinValue={setTopValueMin}
      setMaxValue={setTopValueMax}
      accValue={topValueAcc}
      setAccValue={setTopValueAcc}
    />
  );
}

export function MidValueDialog() {
  const rangeValueRandom = useIndexStore((state) => state.rangeValueRandom);
  const setRangeValueRandom = useIndexStore(
    (state) => state.setRangeValueRandom,
  );
  const rangeValueMax = useIndexStore((state) => state.rangeValueMax);
  const setRangeValueMax = useIndexStore((state) => state.setRangeValueMax);
  const rangeValueMin = useIndexStore((state) => state.rangeValueMin);
  const setRangeValueMin = useIndexStore((state) => state.setRangeValueMin);
  const rangeValueAcc = useIndexStore((state) => state.rangeValueAcc);
  const setRangeValueAcc = useIndexStore((state) => state.setRangeValueAcc);

  return (
    <RandomInputDialog
      isRandom={rangeValueRandom}
      accValue={rangeValueAcc}
      setIsRandom={setRangeValueRandom}
      setAccValue={setRangeValueAcc}
      minValue={rangeValueMin}
      maxValue={rangeValueMax}
      setMinValue={setRangeValueMin}
      setMaxValue={setRangeValueMax}
    />
  );
}

function BottomRandomDialog() {
  const bottomRandom = useIndexStore((state) => state.bottomRandom);
  const setBottomRandom = useIndexStore((state) => state.setBottomRandom);
  const bottomValueMin = useIndexStore((state) => state.bottomValueMin);
  const setBottomValueMin = useIndexStore((state) => state.setBottomValueMin);
  const bottomValueMax = useIndexStore((state) => state.bottomValueMax);
  const setBottomValueMax = useIndexStore((state) => state.setBottomValueMax);
  const bottomValueAcc = useIndexStore((state) => state.bottomValueAcc);
  const setBottomValueAcc = useIndexStore((state) => state.setBottomValueAcc);

  return (
    <RandomInputDialog
      isRandom={bottomRandom}
      minValue={bottomValueMin}
      maxValue={bottomValueMax}
      setIsRandom={setBottomRandom}
      setMinValue={setBottomValueMin}
      setMaxValue={setBottomValueMax}
      accValue={bottomValueAcc}
      setAccValue={setBottomValueAcc}
    />
  );
}
