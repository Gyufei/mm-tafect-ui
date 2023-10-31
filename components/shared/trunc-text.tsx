import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import CopyIcon from "./copy-icon";

const displayText = (
  text: string | undefined,
  start: number = 8,
  end: number = 6,
) => {
  if (!text) {
    return "";
  }

  if (text.length <= start + end) {
    return text;
  } else {
    return text.slice(0, start) + "..." + text.slice(-end);
  }
};

export default function TruncateText({
  text,
  showCopy,
  start = 8,
  end = 6,
  children,
}: {
  text: string;
  showCopy?: boolean;
  start?: number;
  end?: number;
  children?: React.ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center">
            {displayText(text, start, end)}
            {showCopy && <CopyIcon text={text} />}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center">
            <p className="text-sm text-content-color">{text}</p>
            {children}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
