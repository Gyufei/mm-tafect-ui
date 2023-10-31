"use client";
import { useState } from "react";
import { PenLine } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import useIndexStore from "@/lib/state";
import DetailItem from "../shared/detail-item";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TzList } from "@/lib/constants";

export default function ChangeTimezone() {
  const [showChangeDialog, setShowChangeDialog] = useState(false);

  const timezone = useIndexStore((state) => state.timezone);
  const timezoneText = useIndexStore((state) => state.timezoneText());
  const setTimezone = useIndexStore((state) => state.setTimezone);

  const handleSelect = (val: string) => {
    setTimezone(val);
  };

  return (
    <DetailItem title="Timezone">
      <div className="relative flex h-10 w-full flex-col justify-center">
        <div
          className="flex items-center gap-x-3"
          onClick={() => setShowChangeDialog(true)}
        >
          <span>{timezoneText}</span>
          <PenLine className="h-6 w-6" />
        </div>
        <Dialog
          open={showChangeDialog}
          onOpenChange={(val) => setShowChangeDialog(val)}
        >
          <DialogContent
            title="Timezone"
            showClose={true}
            className="w-[320px] outline-none"
          >
            <div className="flex flex-col gap-y-5 px-4">
              <Select
                value={timezone || undefined}
                onValueChange={(e) => handleSelect(e)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select OP" />
                </SelectTrigger>
                <SelectContent className="h-[180px] overflow-y-scroll">
                  {(TzList || []).map((t: { value: number; text: string }) => (
                    <SelectItem key={t.value} value={String(t.value)}>
                      {t.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DetailItem>
  );
}
