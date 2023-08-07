import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { ChevronDown } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUser } from "@/lib/types/user";

export function UserBox() {
  const { data: session } = useSession();
  const currentUser: IUser = session?.user as IUser;

  const [openPopover, setOpenPopover] = useState(false);

  function handleSignOut() {
    signOut();
    window.localStorage.clear();
  }

  return (
    <div
      className="flex h-[70px] items-center justify-start pl-6"
      style={{
        boxShadow:
          "inset 1px 0px 0px 0px #d6d6d6, inset 0px -1px 0px 0px #d6d6d6",
      }}
    >
      <Avatar className="mr-3 h-8 w-8 rounded">
        <AvatarImage src={currentUser?.image || ""} />
        <AvatarFallback>{currentUser?.name?.[0] || ""}</AvatarFallback>
      </Avatar>
      <Popover
        open={openPopover}
        onOpenChange={(isOpen) => setOpenPopover(isOpen)}
      >
        <PopoverTrigger>
          <div
            onClick={() => setOpenPopover(!openPopover)}
            className="flex cursor-pointer items-center justify-between py-2 pr-4 transition-all duration-75 active:bg-gray-100"
          >
            <p className="mr-1 font-medium text-title-color">
              {currentUser?.name}
            </p>
            <ChevronDown
              className={`h-4 w-4 text-gray-600 transition-all ${
                openPopover ? "rotate-180" : ""
              }`}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[160px] p-1" align="start">
          <div className="rounded-md bg-white">
            <button
              onClick={() => handleSignOut()}
              className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
            >
              Sign Out
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
