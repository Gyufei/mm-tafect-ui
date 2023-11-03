import { useState } from "react";
import { ChevronDown, LogOut, Plus } from "lucide-react";
import Image from "next/image";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUser, checkUserIsValid } from "@/lib/auth/user";
import useIndexStore from "@/lib/state";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import useEffectStore from "@/lib/state/use-store";

export function UserBox() {
  const allUsers = useIndexStore((state) => state.users);
  const activeUser = useEffectStore(useIndexStore, (state) =>
    state.activeUser(),
  );
  const setUserActive = useIndexStore((state) => state.setUserActive);
  const userLogout = useIndexStore((state) => state.userLogout);

  const [openPopover, setOpenPopover] = useState(false);

  function handleSignOut(name: string) {
    userLogout(name);
  }

  function handleChangeUser(user: IUser) {
    if (user?.name === activeUser?.name) return;
    setUserActive(user?.name);
    if (checkUserIsValid(user)) {
      window.location.reload();
    }
  }

  const getName = (user: IUser | null) => {
    if (!user) return "";
    if (user.aliasname) return user.aliasname;
    return user.name;
  };

  return (
    <div className="flex h-[70px] items-center justify-start border-b border-r-0 border-t-0 border-[#d6d6d6] pl-6">
      {activeUser ? (
        <Avatar className="mr-3 h-8 w-8 rounded">
          <AvatarImage src={activeUser?.image || ""} />
          <AvatarFallback>{getName(activeUser)?.[0] || ""}</AvatarFallback>
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
            <span className="mr-1 font-medium text-title-color">
              {getName(activeUser)}
            </span>
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
              const isActive = user.name === activeUser?.name;
              const isValid = checkUserIsValid(user);
              const name = getName(user);

              return (
                <div
                  key={user.name}
                  className="flex cursor-pointer items-center justify-between space-x-2 px-2 py-3 transition-all duration-75  hover:bg-custom-bg-white active:bg-custom-bg-white"
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
                      <AvatarFallback>{name?.[0] || ""}</AvatarFallback>
                    </Avatar>
                    <span>{name}</span>
                  </div>
                  {isValid && (
                    <LogOut
                      className="h-4 w-4 cursor-pointer text-[#999] hover:text-[#da5349]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSignOut(user.name);
                      }}
                    />
                  )}
                </div>
              );
            })}
            <AddNewBtn />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function AddNewBtn() {
  const activeUser = useIndexStore((state) => state.activeUser());
  const updateUsers = useIndexStore((state) => state.addOrUpdateUser);

  const handleClick = () => {
    if (activeUser) {
      updateUsers({
        ...activeUser,
        active: false,
      });
    }
  };

  return (
    <div className="mt-2 flex justify-center py-1" onClick={handleClick}>
      <Button className="h-10 w-[204px] border border-dashed bg-white px-2 text-[#bfbfbf] hover:bg-custom-bg-white">
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
}
