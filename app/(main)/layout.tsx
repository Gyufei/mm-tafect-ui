"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import cx from "classnames";
import * as Avatar from "@radix-ui/react-avatar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UserAvatar from "@/components/shared/UserAvatar";
import { AuthRedirect } from "@/lib/auth";
import { signOut, useSession } from "next-auth/react";
import { IUser } from "@/lib/types/user";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Links = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "KeyStore",
    href: "/keyStore",
  },
  {
    name: "TokenSwap",
    href: "/tokenSwap",
  },
  {
    name: "Setting",
    href: "/setting",
  },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  AuthRedirect();

  const pathname = usePathname();

  return (
    <div className="flex h-full items-stretch">
      <div className="flex h-full grow flex-col">
        <TopBar pathname={pathname} />
        {children}
      </div>

      <div
        className="flex h-full w-[240px] flex-col bg-[#f4f5fa]"
        style={{
          boxShadow: "inset 1px 0px 0px 0px #d6d6d6",
        }}
      >
        <UserBox />
        <LinkGroup pathname={pathname} />
      </div>
    </div>
  );
}

function TopBar({ pathname }: { pathname: string }) {
  const title = Links.find(
    (link) => link.href === pathname || pathname.includes(link.href),
  )?.name;

  return (
    <div
      className="flex h-[70px] min-h-[70px] items-center justify-start bg-white"
      style={{
        boxShadow: "inset 0px -1px 0px 0px #d6d6d6",
      }}
    >
      <div className="ml-3 h-12 w-12 rounded-full bg-[#d8d8d8]"></div>
      <div className="flex flex-1 items-center justify-center">{title}</div>
    </div>
  );
}

function UserBox() {
  const { data: session } = useSession();
  const currentUser: IUser = session?.user as IUser;

  const [openPopover, setOpenPopover] = useState(false);

  return (
    <div
      className="flex h-[70px] items-center justify-start pl-6"
      style={{
        boxShadow:
          "inset 1px 0px 0px 0px #d6d6d6, inset 0px -1px 0px 0px #d6d6d6",
      }}
    >
      <UserAvatar
        className="mr-3 h-8 w-8 rounded"
        src={currentUser?.avatar}
        userName={currentUser?.name || ""}
      />
      <Popover
        open={openPopover}
        onOpenChange={(isOpen) => setOpenPopover(isOpen)}
      >
        <PopoverTrigger>
          <button
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
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="w-full rounded-md bg-white p-2 sm:w-40">
            <button
              onClick={() => signOut()}
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

function LinkGroup({ pathname }: { pathname: string }) {
  return (
    <div className="flex flex-1 flex-col justify-start px-4 py-3">
      {Links.map((link) => (
        <Link
          key={link.name}
          className={cx(
            "SideLink",
            (pathname === link.href || pathname.includes(link.href)) &&
              "active",
          )}
          href={link.href}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}
