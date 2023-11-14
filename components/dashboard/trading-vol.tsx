import Image from "next/image";
import numbro from "numbro";

import { useMemo, useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { replaceStrNum } from "@/lib/hooks/use-str-num";
import useIndexStore from "@/lib/state";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function TradingVol() {
  const totalTradingVol = useIndexStore((state) => state.totalTradingVolume);
  const setTotalTradingVol = useIndexStore(
    (state) => state.setTotalTradingVolume,
  );

  return (
    <div className="flex flex-col rounded-md border border-[#bfbfbf]  bg-[#f6f7f8] p-3">
      <div className="LabelText">Total Trading Vol.</div>
      <BaseDialog value={totalTradingVol} setValue={setTotalTradingVol} />
    </div>
  );
}

function BaseDialog(props: { value: string; setValue: (val: string) => void }) {
  const [open, setOpen] = useState(false);

  const [value, setValue] = useState(props.value);

  const handleConfirm = () => {
    props.setValue(value);
    setOpen(false);
  };

  const handleValueChange = (val: string) => {
    let newV = replaceStrNum(val);

    if (Number(newV) < 0) {
      newV = "0";
    }

    setValue(newV);
  };

  const nowShowText = useMemo(() => {
    if (!props.value) return "";
    const display = numbro(props.value).format({ thousandSeparated: true });
    return `$${display}`;
  }, [props]);

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger asChild>
        <div className="flex items-center">
          <span className="mr-2 h-7 text-left text-lg text-[#333]">
            {nowShowText}
          </span>
          <Image
            className="cursor-pointer"
            src="/icons/edit.svg"
            width={20}
            height={20}
            alt="edit"
          />
        </div>
      </DialogTrigger>
      <DialogContent title="Title" className="w-[320px]" showClose="Cancel">
        <div className="flex flex-col gap-y-[10px] px-4">
          <div className="mt-[10px]">
            <div className="LabelText mb-1">Value</div>
            <Input
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
              className="flex-1 rounded-md border-border-color"
              placeholder="0"
            />
          </div>

          <Button
            disabled={!value}
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
