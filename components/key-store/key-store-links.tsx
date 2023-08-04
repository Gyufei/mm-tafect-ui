"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, PlusCircle } from "lucide-react";

import { PathMap } from "@/lib/path-map";

import fetcher from "@/lib/fetcher";
import { redirect } from "next/navigation";
import useSWR from "swr";

export default function KeyStoreLinks() {
  const pathname = usePathname();
  const currentId = pathname.split("/")[2] || "";

  const { data: keyStores, mutate } = useSWR(PathMap.userKeyStores, fetcher);

  useEffect(() => {
    if (keyStores?.length > 0 && pathname === "/key-store") {
      redirect("/key-store/" + keyStores[0]);
    }
  }, [keyStores, pathname]);

  return (
    <>
      <div className="flex flex-col self-stretch pt-3">
        {(keyStores || []).map((ks: string) => (
          <Link key={ks} href={`/key-store/${ks}`}>
            <div
              className="mb-3 flex w-full cursor-pointer justify-between rounded-s border border-transparent px-3 py-[10px] text-content-color"
              style={
                currentId === String(ks)
                  ? {
                      borderColor: "#d7d9df",
                      borderStyle: "solid",
                      backgroundColor: "#e9eaee",
                      color: "#000",
                    }
                  : {}
              }
            >
              {ks}
              <ChevronRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
      <div className="mb-3 w-full pr-3">
        <button
          onClick={() => mutate()}
          className="flex w-full items-center justify-center rounded border border-primary bg-white py-2 text-base text-primary hover:bg-custom-bg-white"
        >
          <PlusCircle className="mb-[2px] mr-2 h-4 w-4" />
          Load KeyStore
        </button>
      </div>
    </>
  );
}
