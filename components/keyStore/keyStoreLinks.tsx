"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import "./index.css";
import { cn } from "@/lib/utils";
import { Path } from "@/lib/path";

import { useFetch } from "@/lib/hooks/use-fetch";
import { useEffect, useMemo } from "react";
import { redirect } from "next/navigation";

export default function KeyStoreLinks() {
  const pathname = usePathname();
  const { data } = useFetch(Path.keyStores);

  const currentId = useMemo(() => pathname.split("/")[2], [pathname]);
  const keyStores = useMemo(() => data?.data?.keystore_name_list || [], [data]);
  console.log("data---", data);

  useEffect(() => {
    if (keyStores.length > 0 && pathname === "/keyStore") {
      redirect("/keyStore/" + keyStores[0]);
    }
  }, [keyStores]);

  return (
    <div className="flex flex-col self-stretch pt-3">
      {keyStores.map((ks) => (
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
      ))}
    </div>
  );
}
