"use client";

import { UserBox } from "@/components/layout/user-box";
import { SideNav } from "@/components/layout/side-nav";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="absolute right-0 h-full md:static">
      {!isSidebarOpen && (
        <Menu
          className="absolute left-[-40px] top-5 h-6 w-6 cursor-pointer md:hidden"
          onClick={() => setIsSidebarOpen(true)}
        />
      )}

      <div
        data-state={isSidebarOpen ? "open" : "close"}
        className="relative flex h-full w-[240px] min-w-[240px] flex-col border-l border-shadow-color bg-[#f4f5fa] animate-in slide-in-from-right data-[state=open]:block data-[state=close]:hidden md:static md:animate-none md:data-[state=close]:block"
      >
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="absolute left-[-38px] top-0 flex h-10 w-10 cursor-pointer items-center justify-center border-b border-l bg-[#f4f5fa] md:hidden"
        >
          <Menu />
        </div>
        <UserBox />
        <SideNav />
      </div>
    </div>
  );
}
