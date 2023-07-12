"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";

import "./index.css";
import Popover from "@/components/shared/popover";
import { useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openPopover, setOpenPopover] = useState(false);

  return (
    <div className="flex items-stretch">
      <div className="flex grow flex-col">
        <div className="header-col flex h-[70px] items-center justify-start bg-white">
          <div className="ml-3 h-12 w-12 rounded-full bg-[#d8d8d8]"></div>
          <div className="flex flex-1 items-center justify-center">
            KeyStore
          </div>
        </div>
        <div>{children}</div>
      </div>

      <div className="sider-col flex h-screen w-[240px] flex-col bg-[#f4f5fa]">
        <div className="user-name-con flex h-[70px] items-center justify-start pl-6">
          <Image
            className="mr-3 rounded"
            src="/authjs.webp"
            alt="Icon"
            width={32}
            height={32}
          />
          <Popover
            content={
              <div className="w-full rounded-md bg-white p-2 sm:w-40">
                <button className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200">
                  login out
                </button>
              </div>
            }
            openPopover={openPopover}
            setOpenPopover={setOpenPopover}
          >
            <button
              onClick={() => setOpenPopover(!openPopover)}
              className="w-34 flex items-center justify-between px-4 py-2 transition-all duration-75 focus:outline-none active:bg-gray-100"
            >
              <p className="font-medium text-title-color">NickName</p>
              <ChevronDown
                className={`h-4 w-4 text-gray-600 transition-all ${
                  openPopover ? "rotate-180" : ""
                }`}
              />
            </button>
          </Popover>
        </div>
      </div>
    </div>
  );
}
