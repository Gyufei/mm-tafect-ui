import { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function MobileFoldBtn({
  pages,
  onChange,
}: {
  pages: string[];
  onChange: (page: string) => void;
}) {
  const [openPopover, setOpenPopover] = useState(false);

  return (
    <Popover
      open={openPopover}
      onOpenChange={(isOpen) => setOpenPopover(isOpen)}
    >
      <PopoverTrigger>
        <Button
          variant="outline"
          className="h-10 w-10 border-primary p-0 md:hidden"
        >
          <Image alt="fold" src="/icons/fold.svg" width={16} height={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-1" align="start">
        <div className="rounded-md bg-white">
          {(pages || []).map((page) => (
            <button
              key={page}
              onClick={() => onChange(page)}
              className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
            >
              {page}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
