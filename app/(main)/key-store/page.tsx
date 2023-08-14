"use client";

import fetcher from "@/lib/fetcher";
import { SystemEndPointPathMap } from "@/lib/end-point";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

export default function KeyStore() {
  const pathname = usePathname();
  const { data: keyStores } = useSWR(
    SystemEndPointPathMap.userKeyStores,
    fetcher,
  );

  useEffect(() => {
    if (keyStores?.length > 0 && pathname === "/key-store") {
      redirect("/key-store/" + keyStores[0]);
    }
  }, [keyStores, pathname]);

  return <></>;
}
