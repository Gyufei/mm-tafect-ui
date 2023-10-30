"use client";
import { useState } from "react";
import { PenLine } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import useGlobalState from "@/lib/state";
import DetailItem from "../shared/detail-item";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ChangeTimezone() {
  const [showChangeDialog, setShowChangeDialog] = useState(false);

  const timezone = useGlobalState((state) => state.timezone);
  const timezoneText = useGlobalState((state) => state.timezoneText());
  const tzList = useGlobalState((state) => state.tzList);
  const setTimezone = useGlobalState((state) => state.setTimezone);

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
                <SelectContent>
                  {(tzList || []).map((t: { value: number; text: string }) => (
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
