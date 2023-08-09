"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, PlusCircle, X } from "lucide-react";

import { PathMap } from "@/lib/path-map";

import fetcher from "@/lib/fetcher";
import { redirect } from "next/navigation";
import useSWR from "swr";

export default function KeyStoreLinks({ onDelete }: { onDelete: () => void }) {
  const pathname = usePathname();
  const currentId = pathname.split("/")[2] || "";

  const { data: keyStores, mutate } = useSWR(PathMap.userKeyStores, fetcher);

  useEffect(() => {
    if (keyStores?.length > 0 && pathname === "/key-store") {
      redirect("/key-store/" + keyStores[0]);
    }
  }, [keyStores, pathname]);

  return (
    <div className="flex w-full flex-row items-center justify-start overflow-x-auto border-b border-shadow-color bg-[#f4f5fa] px-3 py-2 md:w-[284px] md:flex-col md:items-start md:justify-between md:overflow-hidden md:border-r md:py-0 md:pl-3 md:pr-0">
      <div className="flex gap-x-3 md:flex-col md:self-stretch md:pt-3">
        {(keyStores || []).map((ks: string) => (
          <Link key={ks} href={`/key-store/${ks}`}>
            <div
              data-state={currentId === String(ks) ? "active" : "inactive"}
              className="flex w-full cursor-pointer items-center justify-between rounded-full border px-3 py-[8px] text-content-color data-[state=active]:border-[#d7d9df] data-[state=active]:bg-[#e9eaee] data-[state=active]:text-[#000] md:mb-3 md:rounded-e-none md:rounded-s md:border-r-0 md:border-transparent md:py-[10px]"
            >
              {ks}
              <ChevronRight className="hidden h-4 w-4 md:block" />
              <X
                onClick={onDelete}
                strokeWidth={3}
                data-state={currentId === String(ks) ? "active" : "inactive"}
                className="ml-3 hidden h-4 w-4 cursor-pointer rounded-full bg-border-color p-1 data-[state=active]:block md:data-[state=active]:hidden"
              />
            </div>
          </Link>
        ))}
      </div>
      <div className="ml-3 md:mb-3 md:ml-0 md:w-full md:pr-3">
        <button
          onClick={() => mutate()}
          className="flex items-center justify-center whitespace-nowrap rounded-full border border-primary bg-white px-3 py-2 text-base text-primary hover:bg-custom-bg-white md:w-full md:rounded md:px-0"
        >
          <PlusCircle className="mb-[2px] mr-2 h-4 w-4" />
          Load KeyStore
        </button>
      </div>
    </div>
  );
}
