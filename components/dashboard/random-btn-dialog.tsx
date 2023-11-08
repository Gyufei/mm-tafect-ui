import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

import CandleOpRow from "./candle-op-row";
import useIndexStore from "@/lib/state";
import { Input } from "../ui/input";
import { replaceStrNum } from "@/lib/hooks/use-str-num";
import { Button } from "../ui/button";

export default function RandomBtnDialog({ up }: { up: boolean }) {
  return up ? <TopRandomDialog /> : <BottomRandomDialog />;
}

function TopRandomDialog() {
  const topRandom = useIndexStore((state) => state.topRandom);
  const setTopRandom = useIndexStore((state) => state.setTopRandom);
  const topValueMin = useIndexStore((state) => state.topValueMin);
  const setTopValueMin = useIndexStore((state) => state.setTopValueMin);
  const topValueMax = useIndexStore((state) => state.topValueMax);
  const setTopValueMax = useIndexStore((state) => state.setTopValueMax);

  return (
    <BaseDialog
      isRandom={topRandom}
      minValue={topValueMin}
      maxValue={topValueMax}
      setIsRandom={setTopRandom}
      setMinValue={setTopValueMin}
      setMaxValue={setTopValueMax}
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

  return (
    <BaseDialog
      isRandom={bottomRandom}
      minValue={bottomValueMin}
      maxValue={bottomValueMax}
      setIsRandom={setBottomRandom}
      setMinValue={setBottomValueMin}
      setMaxValue={setBottomValueMax}
    />
  );
}

function BaseDialog(props: {
  isRandom: boolean;
  minValue: string;
  maxValue: string;
  setIsRandom: (val: boolean) => void;
  setMinValue: (val: string) => void;
  setMaxValue: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isRandom, setIsRandom] = useState(props.isRandom);
  const [minValue, setMinValue] = useState(props.minValue);
  const [maxValue, setMaxValue] = useState(props.maxValue);

  const handleConfirm = () => {
    props.setIsRandom(isRandom);
    props.setMinValue(minValue);
    props.setMaxValue(maxValue);
    setOpen(false);
  };
  console.log(handleConfirm, setMinValue, setMaxValue);

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

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger>
        <CandleOpRow text="Random" onEdit={() => {}} />
      </DialogTrigger>
      <DialogContent title="Title" className="w-[320px]" showClose="Cancel">
        <div className="flex flex-col gap-y-[10px] px-4">
          <div className="flex items-center">
            <Checkbox
              checked={isRandom}
              onCheckedChange={() => setIsRandom(!isRandom)}
              id="random"
            />
            <label className="LabelText ml-2 cursor-pointer" htmlFor="random">
              Random
            </label>
          </div>

          {!isRandom && (
            <>
              <div className="flex items-center">
                <div className="h-[1px] flex-1 bg-[#99999966]" />
                <div className="LabelText mx-1">OR</div>
                <div className="h-[1px] flex-1 bg-[#99999966]" />
              </div>

              <div>
                <div className="LabelText mb-1">Value</div>
                <div className="flex items-center justify-between">
                  <Input
                    value={minValue}
                    onChange={(e) => handleMinValueChange(e.target.value)}
                    className="flex-1 rounded-md border-border-color"
                    placeholder="0"
                  />
                  <span className="LabelText mx-1">-</span>
                  <Input
                    value={maxValue}
                    onChange={(e) => handleMaxValueChange(e.target.value)}
                    className="flex-1 rounded-md border-border-color"
                    placeholder="0"
                  />
                </div>
              </div>
            </>
          )}

          <Button
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
