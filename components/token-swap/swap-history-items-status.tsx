import { X } from "lucide-react";

import { StatusEnum } from "@/lib/types/task";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SwapHistoryItemStatus({
  status,
  onCancelQueue,
}: {
  status: StatusEnum;
  onCancelQueue?: () => void;
}) {
  const colorMap = {
    [StatusEnum["pre-queue"]]: {
      color: "#777777",
      bg: "#F8F8F8",
      border: "#E0E0E0",
    },
    [StatusEnum.queue]: {
      color: "#0572ec",
      bg: "rgba(5, 114, 236, 0.1)",
      border: " rgba(5, 114, 236, 0.4)",
    },
    [StatusEnum.pending]: {
      color: "#EF814F",
      bg: "rgba(239, 129, 79, 0.1)",
      border: "rgba(239, 129, 79, 0.4)",
    },
    [StatusEnum.finished]: {
      color: "#07D498",
      bg: "rgba(7, 212, 152, 0.1)",
      border: "rgba(7, 212, 152, 0.4)",
    },
    [StatusEnum.failed]: {
      color: "#D42C1F",
      bg: "rgba(212, 44, 31, 0.1)",
      border: "rgba(212, 44, 31, 0.4)",
    },
    [StatusEnum.cancel]: {
      color: "#707070",
      bg: "#E9EAEE",
      border: "#bfbfbf",
    },
    [StatusEnum.replace]: {
      color: "#FFFFFF",
      bg: "#3388FF",
      border: "#73B2FF",
    },
    [StatusEnum.dequeue]: {
      color: "#FFF",
      bg: "rgba(212, 44, 31, 0.8)",
      border: "rgba(212, 44, 31, 0.8)",
    },
  };

  const colorVars = colorMap[status];

  return (
    <div
      style={{
        color: colorVars.color,
        backgroundColor: colorVars.bg,
        border: `1px solid ${colorVars.border}`,
      }}
      className="rounded-full bg-[#e9eaee] px-3 text-sm"
    >
      <div className="flex items-center">
        {StatusEnum[status]}
        {StatusEnum[status] === "pre-queue" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <X
                  onClick={onCancelQueue}
                  className="ml-2 h-3 w-3 cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm text-content-color">Dequeue</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
