"use client";

import { usePathname } from "next/navigation";
import { LINKS } from "@/lib/constants/global";

export default function TopBarTitle() {
  const pathname = usePathname();

  const title = LINKS.find(
    (link) => link.href === pathname || pathname.includes(link.href),
  )?.name;

  return <>{title}</>;
}
