"use client";

import fetcher from "@/lib/fetcher";
import { PathMap } from "@/lib/path-map";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

export default function KeyStore() {
  const pathname = usePathname();
  const { data: keyStores } = useSWR(PathMap.userKeyStores, fetcher);

  useEffect(() => {
    if (keyStores?.length > 0 && pathname === "/key-store") {
      redirect("/key-store/" + keyStores[0]);
    }
  }, [keyStores, pathname]);

  return <></>;
}
