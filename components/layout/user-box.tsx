import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import Image from "next/image";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUser } from "@/lib/auth/user";
import { isAfter } from "date-fns";
import useIndexStore from "@/lib/state";
import { Skeleton } from "../ui/skeleton";

export function UserBox() {
  const allUsers = useIndexStore((state) => state.users);
  const activeUser = useIndexStore((state) => state.activeUser());
  const setUserActive = useIndexStore((state) => state.setUserActive);
  const userLogout = useIndexStore((state) => state.userLogout);

  const [openPopover, setOpenPopover] = useState(false);

  function handleSignOut(name: string) {
    userLogout(name);
  }

  function handleChangeUser(user: IUser) {
    if (user?.name === activeUser?.name) return;
    setUserActive(user?.name);
    window.location.reload();
  }

  return (
    <div className="flex h-[70px] items-center justify-start border-b border-r-0 border-t-0 border-[#d6d6d6] pl-6">
      {activeUser ? (
        <Avatar className="mr-3 h-8 w-8 rounded">
          <AvatarImage src={activeUser?.image || ""} />
          <AvatarFallback>{activeUser?.name?.[0] || ""}</AvatarFallback>
        </Avatar>
      ) : (
        <Skeleton className="mr-3 h-8 w-8 rounded-full" />
      )}
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
              {activeUser?.name}
            </p>
            <ChevronDown
              className={`h-4 w-4 text-gray-600 transition-all ${
                openPopover ? "rotate-180" : ""
              }`}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="mr-4 w-[220px] px-0 py-2" align="start">
          <div className="rounded-md bg-white">
            {allUsers?.map((user) => {
              const isOnlyUser = allUsers?.length === 1;
              const isActive = user.name === activeUser?.name;
              const isValid = user?.expires
                ? isAfter(user?.expires, new Date())
                : false;

              const showLogout =
                isOnlyUser || (!isOnlyUser && !isActive && isValid);

              return (
                <div
                  key={user.name}
                  className="flex cursor-pointer items-center justify-between space-x-2 px-2 py-1 transition-all duration-75  hover:bg-custom-bg-white active:bg-custom-bg-white"
                  onClick={() => handleChangeUser(user)}
                >
                  <div className="flex items-center">
                    <div className="w-6">
                      {isActive && (
                        <Image
                          alt="check"
                          src="/icons/cur-check.svg"
                          width={24}
                          height={24}
                        />
                      )}
                    </div>
                    <Avatar className="mr-3 h-8 w-8 rounded">
                      <AvatarImage src={activeUser?.image || ""} />
                      <AvatarFallback>{user?.name?.[0] || ""}</AvatarFallback>
                    </Avatar>
                    <span>{user?.name}</span>
                  </div>
                  {showLogout && (
                    <LogOut
                      className="h-4 w-4 cursor-pointer text-[#999]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSignOut(user.name);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
