import { useState } from "react";
import { ChevronDownCircle } from "lucide-react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import UnlockIcon from "@/components/icons/unlock";
import LockIcon from "@/components/icons/lock";
import NoCheckIcon from "@/components/icons/noCheck";
import { replaceStrNum, replaceStrNumNoDecimal } from "@/lib/hooks/use-str-num";

export interface IAdvanceOptions {
  schedule: Date | null;
  timeout: number | null;
  slippage: string | null;
  nonce: number | null;
  gas: number | null;
  fixed_gas: boolean;
  no_check_gas: boolean;
}

export default function OpAdvanceOptions({
  options,
  onChange,
}: {
  options: IAdvanceOptions;
  onChange: (_o: IAdvanceOptions) => void;
}) {
  function handleAdvanceOptionsChange(key: string, value: any) {
    if (key === "timeout" || key === "slippage" || key === "gas") {
      value = value ? replaceStrNum(value) : null;
    }

    if (key === "nonce") {
      value = value ? Number(replaceStrNumNoDecimal(value)) : null;
    }

    if (key === "schedule") {
      value = (new Date(value).getTime() / 1000).toFixed();
    }

    onChange({
      ...options,
      [key]: value,
    });
  }

  return (
    <AdvanceCollapsible>
      <div className="flex flex-col gap-y-3 px-3">
        <div className="flex justify-between gap-x-3">
          <div className="flex max-w-[150px] flex-col">
            <div className="LabelText mb-1">Timeout(s)</div>
            <Input
              value={options.timeout || ""}
              onChange={(e) =>
                handleAdvanceOptionsChange("timeout", e.target.value)
              }
              className="rounded-md border-border-color"
              placeholder="0"
            />
          </div>
          <div className="flex flex-1 flex-col">
            <div className="LabelText mb-1">Slippage</div>
            <div className="relative">
              <Input
                className="rounded-md border-border-color"
                placeholder="0"
                value={options.slippage || ""}
                onChange={(e) =>
                  handleAdvanceOptionsChange("slippage", e.target.value)
                }
              />
              <div className="absolute right-2 top-[7px] select-none text-title-color">
                %
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-x-3">
          <div>
            <div className="LabelText mb-1">Nonce</div>
            <Input
              value={options.nonce || ""}
              onChange={(e) =>
                handleAdvanceOptionsChange("nonce", e.target.value)
              }
              className="rounded-md border-border-color"
              placeholder="0"
            />
          </div>
          <div>
            <div className="LabelText mb-1">Gas(gwei)</div>
            <Input
              value={String(Number(options.gas) / 10 ** 9) || ""}
              onChange={(e) =>
                handleAdvanceOptionsChange("gas", e.target.value)
              }
              className="rounded-md border-border-color"
              placeholder="0"
            />
          </div>
          <button
            onClick={() =>
              handleAdvanceOptionsChange("fixed_gas", !options.fixed_gas)
            }
            className="flex h-10 cursor-pointer items-center justify-center rounded-md border px-[11px] hover:bg-custom-bg-white"
          >
            {options.fixed_gas ? (
              <LockIcon className="text-primary" />
            ) : (
              <UnlockIcon className="text-[#999]" />
            )}
          </button>
          <button
            onClick={() =>
              handleAdvanceOptionsChange("no_check_gas", !options.no_check_gas)
            }
            className="flex h-10 cursor-pointer items-center justify-center rounded-md border px-[11px] hover:bg-custom-bg-white"
          >
            <NoCheckIcon
              className="text-primary"
              style={{
                color: options.no_check_gas ? "#999" : "",
              }}
            />
          </button>
        </div>

        <div className="flex flex-col">
          <div className="LabelText mb-1">Schedule Time</div>
          <div className="flex justify-between gap-x-3">
            <DateTimePicker
              ampm={false}
              closeOnSelect={true}
              disablePast={true}
              timeSteps={{ hours: 1, minutes: 1 }}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
              value={
                options.schedule
                  ? new Date(Number(options.schedule) * 1000)
                  : null
              }
              onChange={(e: Date | null) =>
                handleAdvanceOptionsChange("schedule", e)
              }
              format="yyyy-MM-dd HH:mm"
            />
            <button
              onClick={() => handleAdvanceOptionsChange("schedule", new Date())}
              className="flex h-10 w-[92px] cursor-pointer items-center justify-center rounded-md border hover:bg-custom-bg-white"
            >
              Now
            </button>
          </div>
        </div>
      </div>
    </AdvanceCollapsible>
  );
}

function AdvanceCollapsible({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible className="mt-6 w-full" open={open} onOpenChange={setOpen}>
      <div className="mb-4 flex items-center pl-3">
        <div className="mr-3 text-xs font-medium text-title-color">Advance</div>
        <div className="h-[1px] flex-1 bg-shadow-color" />
        <CollapsibleTrigger asChild>
          <ChevronDownCircle
            className="mx-3 h-4 w-4 cursor-pointer text-content-color"
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </CollapsibleTrigger>
        <div className="h-[1px] w-[10px] bg-shadow-color" />
      </div>

      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}
