"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Loader, PlusCircle } from "lucide-react";

import "./index.css";
import { cn } from "@/lib/utils";
import { PathMap } from "@/lib/path";

import { useFetcher } from "@/lib/hooks/use-fetcher";
import { useEffect, useMemo } from "react";
import { redirect } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import useSWR from "swr";

export default function KeyStoreLinks() {
  const fetcher = useFetcher();
  const pathname = usePathname();

  const { data, mutate, isLoading } = useSWR(PathMap.keyStores, fetcher);
  const currentId = useMemo<string>(() => pathname.split("/")[2], [pathname]);
  const keyStores = useMemo<Array<string>>(
    () => data?.keystore_name_list || [],
    [data],
  );

  useEffect(() => {
    if (keyStores.length > 0 && pathname === "/keyStore") {
      redirect("/keyStore/" + keyStores[0]);
    }
  }, [keyStores, pathname]);

  return (
    <>
      <div className="flex flex-col self-stretch pt-3">
        {!isLoading && keyStores.length ? (
          keyStores.map((ks) => (
            <Link key={ks} href={`/keyStore/${ks}`}>
              <div
                className={cn(
                  "mb-3 flex w-full cursor-pointer justify-between rounded-s border border-transparent px-3 py-[10px] text-content-color",
                  currentId === String(ks) && "ks-link-active",
                )}
              >
                {ks}
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          ))
        ) : (
          <Skeleton className="mr-2 h-[46px] w-[284px] bg-[#e9eaee]" />
        )}
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
