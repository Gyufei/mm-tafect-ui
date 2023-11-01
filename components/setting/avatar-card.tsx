"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useIndexStore from "@/lib/state";
import useEffectStore from "@/lib/state/use-store";
import { useMemo } from "react";

export default function AvatarCard() {
  const activeUser = useEffectStore(useIndexStore, (state) =>
    state.activeUser(),
  );

  const name = useMemo(() => {
    if (!activeUser) return "";
    if (activeUser.aliasname) return activeUser.aliasname;
    return activeUser.name;
  }, [activeUser]);

  return (
    <div className="flex h-40 w-72 flex-col items-center justify-center rounded-md border border-border-color bg-[#f4f5fa]">
      <Avatar className="mr-3 h-[60px] w-[60px] rounded-md bg-[#EEDE9A]">
        <AvatarImage src={activeUser?.image || ""} />
        <AvatarFallback className="bg-[#eede9a] text-2xl">
          {name?.[0] || ""}
        </AvatarFallback>
      </Avatar>
      <div className="mt-4 min-w-[48px]">ID: {activeUser?.id}</div>
    </div>
  );
}
