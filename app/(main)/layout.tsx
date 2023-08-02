"use client";

import { usePathname } from "next/navigation";

import { TopBar } from "@/components/layout/top-bar";
import { UserBox } from "@/components/layout/user-box";
import { SideNav } from "@/components/layout/side-nav";

import Web3Provider from "@/lib/providers/web3-provider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full items-stretch">
      <div className="flex h-full grow flex-col">
        <TopBar pathname={pathname} />
        <Web3Provider>{children}</Web3Provider>
      </div>

      <div
        className="flex h-full w-[240px] min-w-[240px] flex-col bg-[#f4f5fa]"
        style={{
          boxShadow: "inset 1px 0px 0px 0px #d6d6d6",
        }}
      >
        <UserBox />
        <SideNav pathname={pathname} />
      </div>
    </div>
  );
}
