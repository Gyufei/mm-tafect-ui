"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { UserManageContext } from "@/lib/providers/user-manage-provider";
import { useContext } from "react";

export default function AvatarCard() {
  const { currentUser: user } = useContext(UserManageContext);

  return (
    <div className="flex h-40 w-72 flex-col items-center justify-center rounded-md border border-border-color bg-[#f4f5fa]">
      <Avatar className="mr-3 h-[60px] w-[60px] rounded-md bg-[#EEDE9A]">
        <AvatarImage src={user?.image || ""} />
        <AvatarFallback className="bg-[#eede9a] text-2xl">
          {user?.name?.[0] || ""}
        </AvatarFallback>
      </Avatar>
      <div className="mt-4">ID: {user?.name}</div>
    </div>
  );
}
