import { useMemo, useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "../ui/label";

import {
  IRangeValueType,
  RangeValueTypes,
} from "@/lib/constants/dashboard-const";
import { replaceStrNum } from "@/lib/hooks/use-str-num";
import useIndexStore from "@/lib/state";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import CandleOpRow from "./candle-op-row";

export default function RangeValueDialog() {
  const rangeValueType = useIndexStore((state) => state.rangeValueType);
  const setRangeValueType = useIndexStore((state) => state.setRangeValueType);
  const rangeValueMax = useIndexStore((state) => state.rangeValueMax);
  const setRangeValueMax = useIndexStore((state) => state.setRangeValueMax);
  const rangeValueMin = useIndexStore((state) => state.rangeValueMin);
  const setRangeValueMin = useIndexStore((state) => state.setRangeValueMin);

  return (
    <BaseDialog
      type={rangeValueType}
      minValue={rangeValueMin}
      maxValue={rangeValueMax}
      setType={setRangeValueType}
      setMinValue={setRangeValueMin}
      setMaxValue={setRangeValueMax}
    />
  );
}

function BaseDialog(props: {
  type: IRangeValueType;
  minValue: string;
  maxValue: string;
  setType: (val: IRangeValueType) => void;
  setMinValue: (val: string) => void;
  setMaxValue: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const [type, setType] = useState(props.type);
  const [minValue, setMinValue] = useState(props.minValue);
  const [maxValue, setMaxValue] = useState(props.maxValue);

  const handleConfirm = () => {
    props.setType(type);
    props.setMinValue(minValue);
    props.setMaxValue(maxValue);
    setOpen(false);
  };

  const handleMinValueChange = (val: string) => {
    let newV = replaceStrNum(val);

    if (Number(newV) < 0) {
      newV = "0";
    }

    setMinValue(newV);
  };

  const handleMaxValueChange = (val: string) => {
    let newV = replaceStrNum(val);

    if (Number(newV) > 100) {
      newV = "100";
    }

    setMaxValue(newV);
  };

  const handleMinBlur = () => {
    if (!maxValue || !minValue) return;
    if (Number(minValue) > Number(maxValue)) {
      setMinValue(maxValue);
    }
  };

  const handleMaxBlur = () => {
    if (!maxValue || !minValue) return;
    if (Number(maxValue) < Number(minValue)) {
      setMaxValue(minValue);
    }
  };

  const nowShowText = useMemo(() => {
    if (!props.minValue && !props.maxValue) return "";
    if (!props.minValue) return `${props.maxValue}%`;
    if (!props.maxValue) return `${props.minValue}%`;
    return `${props.minValue}%~${props.maxValue}%`;
  }, [props]);

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger>
        <CandleOpRow text={nowShowText} />
      </DialogTrigger>
      <DialogContent title="Title" className="w-[320px]" showClose="Cancel">
        <div className="flex flex-col gap-y-[10px] px-4">
          <div className="flex items-center">
            <LabelRadio
              options={RangeValueTypes}
              value={type}
              onChange={setType}
            />
          </div>

          <div className="mt-[10px]">
            <div className="LabelText mb-1">Value</div>
            <div className="flex items-center justify-between">
              <Input
                value={minValue}
                onChange={(e) => handleMinValueChange(e.target.value)}
                onBlur={handleMinBlur}
                className="flex-1 rounded-md border-border-color"
                placeholder="0"
              />
              <span className="LabelText mx-1">-</span>
              <Input
                value={maxValue}
                onChange={(e) => handleMaxValueChange(e.target.value)}
                onBlur={handleMaxBlur}
                className="flex-1 rounded-md border-border-color"
                placeholder="0"
              />
            </div>
          </div>

          <Button
            disabled={!minValue || !maxValue}
            onClick={handleConfirm}
            className="mt-[10px] w-full rounded-full bg-primary text-white disabled:border disabled:border-[#bfbfbf] disabled:bg-[#F6F7F8] disabled:text-[#999]"
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LabelRadio({
  options,
  value,
  onChange,
}: {
  options: typeof RangeValueTypes;
  value: IRangeValueType;
  onChange: (value: IRangeValueType) => void;
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
          <Label htmlFor={opt} className="cursor-pointer text-sm text-[#333]">
            {opt}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
