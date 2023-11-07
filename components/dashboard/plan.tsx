import { useState } from "react";
import Image from "next/image";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Label } from "../ui/label";
import Candle from "./candle";
import TradingVol from "./trading-vol";
import TradingTx from "./trading-tx";

export default function Plan() {
  const labelOptions = ["Up", "Down"];
  const [upDownValue, setUpDownValue] = useState(labelOptions[0]);

  const handleRandom = () => {};
  const handleRange = () => {};

  return (
    <div className="mb-[17px]">
      <div className="mb-1 text-sm text-[#707070]">Plan</div>
      <div className="flex gap-x-3">
        <div className="w-[182px] rounded-md border border-[#bfbfbf] bg-[#f6f7f8] p-3">
          <LabelRadio
            options={labelOptions}
            value={upDownValue}
            onChange={setUpDownValue}
          />
          <div className="mt-4 flex">
            <Candle up={upDownValue === labelOptions[0]} />
            <div className="ml-7 flex flex-col justify-between">
              <CandleOpRow text="Random" onEdit={handleRandom} />
              <CandleOpRow text="3~5%" onEdit={handleRange} />
              <CandleOpRow text="Random" onEdit={handleRandom} />
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

function DashArrow() {
  return (
    <Image src="/icons/dash-arrow.png" width={36} height={6} alt="arrow" />
  );
}

function CandleOpRow({ text, onEdit }: { text: string; onEdit: () => void }) {
  return (
    <div className="flex items-center">
      <DashArrow />
      <span className="mx-2 text-sm text-[#333]">{text}</span>
      <Image
        className="cursor-pointer"
        onClick={onEdit}
        src="/icons/edit.svg"
        width={20}
        height={20}
        alt="edit"
      />
    </div>
  );
}
