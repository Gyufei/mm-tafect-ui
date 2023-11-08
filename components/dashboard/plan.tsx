import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Label } from "../ui/label";
import Candle from "./candle";
import TradingVol from "./trading-vol";
import TradingTx from "./trading-tx";
import { DashboardUpDownLabelOptions } from "@/lib/constants";
import useIndexStore from "@/lib/state";
import CandleOpRow from "./candle-op-row";
import RandomBtnDialog from "./random-btn-dialog";

export default function Plan() {
  const upOrDown = useIndexStore((state) => state.upOrDown);
  const setUpOrDown = useIndexStore((state) => state.setUpOrDown);

  const handleRange = () => {};

  return (
    <div className="mb-[17px]">
      <div className="LabelText mb-1">Plan</div>
      <div className="flex gap-x-3">
        <div className="w-[182px] rounded-md border border-[#bfbfbf] bg-[#f6f7f8] p-3">
          <LabelRadio
            options={DashboardUpDownLabelOptions}
            value={upOrDown}
            onChange={setUpOrDown}
          />
          <div className="mt-4 flex">
            <Candle up={upOrDown === DashboardUpDownLabelOptions[0]} />
            <div className="ml-7 flex flex-col justify-between">
              <RandomBtnDialog up={true} />
              <CandleOpRow text="3~5%" onEdit={handleRange} />
              <RandomBtnDialog up={false} />
            </div>
          </div>
        </div>

        <div className="flex w-[182px] flex-col items-stretch gap-y-3">
          <TradingVol />
          <TradingTx />
        </div>
      </div>
    </div>
  );
}

function LabelRadio({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <RadioGroup
      className="flex items-center"
      value={value}
      onValueChange={onChange}
    >
      {options.map((opt) => (
        <div key={opt} className="flex items-center space-x-2">
          <RadioGroupItem className="h-[14px] w-[14px]" value={opt} id={opt} />
          <Label htmlFor={opt} className="text-sm text-[#333]">
            {opt}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
