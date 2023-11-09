import { useMemo, useState } from "react";
import Image from "next/image";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { replaceStrNum } from "@/lib/hooks/use-str-num";
import useIndexStore from "@/lib/state";

export function GasPrice() {
  const useOnlineGas = useIndexStore((state) => state.useOnlineGas);
  const setUseOnlineGas = useIndexStore((state) => state.setUseOnlineGas);
  const gasValue = useIndexStore((state) => state.gasValue);
  const setGasValue = useIndexStore((state) => state.setGasValue);

  return (
    <div className="flex flex-1 flex-col rounded-md border border-[#bfbfbf] p-3">
      <div className="LabelText">Gas Price</div>
      <BaseDialog
        useOnlineGas={useOnlineGas}
        setUseOnlineGas={setUseOnlineGas}
        gasValue={gasValue}
        setGasValue={setGasValue}
      />
    </div>
  );
}

function BaseDialog(props: {
  useOnlineGas: boolean;
  setUseOnlineGas: (val: boolean) => void;
  gasValue: string;
  setGasValue: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [useOnlineGas, setUseOnlineGas] = useState(props.useOnlineGas);
  const [gasValue, setGasValue] = useState(props.gasValue);

  const handleConfirm = () => {
    props.setUseOnlineGas(useOnlineGas);
    props.setGasValue(gasValue);
    setOpen(false);
  };

  const handleGasValueChange = (val: string) => {
    let newV = replaceStrNum(val);

    if (Number(newV) < 0) {
      newV = "0";
    }

    setGasValue(newV);
  };

  const nowShowText = useMemo(() => {
    if (props.useOnlineGas) return "Online Average";
    return `Max:${props.gasValue} Gwei`;
  }, [props]);

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger asChild>
        <div className="flex items-center">
          <span className="mr-2 text-lg text-[#333]">{nowShowText}</span>
          <Image
            className="cursor-pointer"
            src="/icons/edit.svg"
            width={20}
            height={20}
            alt="edit"
          />
        </div>
      </DialogTrigger>
      <DialogContent
        title="Gas Price Threshold"
        className="w-[320px]"
        showClose="Cancel"
      >
        <div className="flex flex-col gap-y-[10px] px-4">
          <div className="flex items-center">
            <Checkbox
              checked={useOnlineGas}
              onCheckedChange={() => setUseOnlineGas(!useOnlineGas)}
              id="online"
            />
            <label className="LabelText ml-2 cursor-pointer" htmlFor="online">
              Onchain Average
            </label>
          </div>

          {!useOnlineGas && (
            <>
              <div className="flex items-center">
                <div className="h-[1px] flex-1 bg-[#99999966]" />
                <div className="LabelText mx-1">OR</div>
                <div className="h-[1px] flex-1 bg-[#99999966]" />
              </div>

              <div>
                <div className="LabelText mb-1">Customize a Max Value</div>
                <div className="flex items-center justify-between">
                  <Input
                    value={gasValue}
                    onChange={(e) => handleGasValueChange(e.target.value)}
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
