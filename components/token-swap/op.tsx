import { use, useState } from "react";
import { DateTimePicker } from "@material-ui/pickers";
import { ArrowBigRight, ChevronDownCircle } from "lucide-react";

import { INetwork } from "@/lib/types/network";
import { IOp } from "@/lib/types/op";
import { IToken } from "@/lib/types/token";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QueryAccountBalance from "@/components/token-swap/query-account-balance";
import OpSelect from "@/components/token-swap/opSelect";

import UnlockIcon from "@/components/icons/unlock";
// import LockIcon from "@/components/icons/lock";
import NoCheckIcon from "@/components/icons/noCheck";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import TokenSelectAndInput, {
  ITokenAddressAndNum as ITokenDesc,
} from "./token-select-and-input";

export default function Op({
  network,
  token,
  queryAccount,
  handleQueryAccountChange,
}: {
  network: INetwork | null;
  token: IToken | null;
  queryAccount: string;
  // eslint-disable-next-line no-unused-vars
  handleQueryAccountChange: (e: string) => void;
}) {
  const [selectedOp, setSelectedOp] = useState<IOp | null>(null);
  const [scheduledDateTime, setScheduledDateTime] = useState<Date | null>();

  function AdvanceCollapsible() {
    const [open, setOpen] = useState(true);

    return (
      <Collapsible className="mt-6 w-full" open={open} onOpenChange={setOpen}>
        <div className="mb-4 flex items-center pl-3">
          <div className="mr-3 text-xs font-medium text-title-color">
            Advance
          </div>
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

        <CollapsibleContent>
          <AdvanceContent />
        </CollapsibleContent>
      </Collapsible>
    );
  }

  function AdvanceContent() {
    return (
      <div className="flex flex-col gap-y-3 px-3">
        <div className="flex justify-between gap-x-3">
          <div className="flex max-w-[150px] flex-col">
            <div className="LabelText mb-1">Timeout(s)</div>
            <Input className="rounded-md border-border-color" placeholder="0" />
          </div>
          <div className="flex flex-1 flex-col">
            <div className="LabelText mb-1">Slippage</div>
            <div className="relative">
              <Input
                className="rounded-md border-border-color"
                placeholder="0"
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
            <Input className="rounded-md border-border-color" placeholder="0" />
          </div>
          <div>
            <div className="LabelText mb-1">Gas(gwei)</div>
            <Input className="rounded-md border-border-color" placeholder="0" />
          </div>
          <button className="flex h-10 cursor-pointer items-center justify-center rounded-md border px-[11px] hover:bg-custom-bg-white">
            <UnlockIcon className="text-[#999]" />
            {/* <LockIcon className="text-primary" /> */}
          </button>
          <button className="flex h-10 cursor-pointer items-center justify-center rounded-md border px-[11px] hover:bg-custom-bg-white">
            <NoCheckIcon
              className="text-primary"
              style={{
                color: "#999",
              }}
            />
          </button>
        </div>

        <div className="flex flex-col">
          <div className="LabelText mb-1">Schedule Time</div>
          <div className="flex justify-between gap-x-3">
            <DateTimePicker
              inputVariant="outlined"
              ampm={false}
              disablePast={true}
              value={scheduledDateTime}
              emptyLabel="Select"
              onChange={(e: Date | null) => setScheduledDateTime(e)}
              format="YYY-MM-dd HH:mm"
              hideTabs={true}
              TextFieldComponent={(props) => (
                <Input
                  {...(props as any)}
                  readOnly
                  className="rounded-md border-border-color"
                  placeholder="0"
                />
              )}
            />
            <button
              onClick={() => setScheduledDateTime(new Date())}
              className="flex h-10 w-[92px] cursor-pointer items-center justify-center rounded-md border hover:bg-custom-bg-white"
            >
              Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [tokenIn, setTokenIn] = useState<ITokenDesc>({
    labelName: "Token0",
    info: null,
    num: "",
  });
  const [tokenOut, setTokenOut] = useState<ITokenDesc>({
    labelName: "Token1",
    info: null,
    num: "",
  });

  const handleTokenInChange = (inParams: ITokenDesc) => {
    setTokenIn(inParams);
    if (inParams.info && inParams.num) {
      console.log("tokenIn:", inParams.info, inParams.num);
    }
  };

  const handleTokenOutChange = (outParams: ITokenDesc) => {
    setTokenOut(outParams);
    if (outParams.info && outParams.num) {
      console.log("tokenOut:", outParams.info, outParams.num);
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col justify-between border-r border-r-[#dadada]">
      <div className="flex flex-col">
        <div className="p-3">
          <div className="LabelText mb-1">OP</div>
          <OpSelect
            networkId={network?.chain_id || null}
            op={selectedOp}
            handleOpSelect={(op) => setSelectedOp(op)}
          />
        </div>

        <QueryAccountBalance
          token={token}
          network={network || null}
          account={queryAccount}
          handleAccountChange={(e: string) => handleQueryAccountChange(e)}
        />

        <div className="mt-3 flex items-center justify-between px-3">
          <TokenSelectAndInput
            networkId={network?.chain_id || null}
            tokenParams={tokenIn}
            handleTokenParamsChange={(tP) => handleTokenInChange(tP)}
          />
          <ArrowBigRight
            className="mx-1 mt-1 h-5 w-5 text-[#7d8998]"
            style={{
              transform: "translateY(10px)",
            }}
          />
          <TokenSelectAndInput
            networkId={network?.chain_id || null}
            tokenParams={tokenOut}
            handleTokenParamsChange={(tP) => handleTokenOutChange(tP)}
          />
        </div>

        <AdvanceCollapsible />
      </div>

      <div
        className="flex items-center gap-x-3 border-t bg-white px-3 py-2"
        style={{
          boxShadow:
            "inset -1px 0px 0px 0px #D6D6D6,inset 0px 1px 0px 0px #D6D6D6",
        }}
      >
        <Button
          variant="outline"
          className="h-[40px] w-[120px] rounded-md border border-primary text-primary"
        >
          Test Tx
        </Button>
        <Button
          variant="outline"
          className="h-[40px] w-[120px] rounded-md border border-primary text-primary"
        >
          Schedule
        </Button>
      </div>
    </div>
  );
}
