"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import useIndexStore from "@/lib/state";

export default function AvatarCard() {
  const activeUser = useIndexStore((state) => state.activeUser());

  return (
    <div className="flex h-40 w-72 flex-col items-center justify-center rounded-md border border-border-color bg-[#f4f5fa]">
      <Avatar className="mr-3 h-[60px] w-[60px] rounded-md bg-[#EEDE9A]">
        <AvatarImage src={activeUser?.image || ""} />
        <AvatarFallback className="bg-[#eede9a] text-2xl">
          {activeUser?.name?.[0] || ""}
        </AvatarFallback>
      </Avatar>
      <div className="mt-4">ID: {activeUser?.name}</div>
    </div>
  );
}
