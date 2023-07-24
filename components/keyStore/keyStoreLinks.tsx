"use client";

import cx from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import "./index.css";

export default function KeyStoreLinks({ keyStores }: { keyStores: any[] }) {
  const pathname = usePathname();
  const currentId = pathname.split("/")[2];
  console.log(currentId);

  return (
    <div className="flex flex-col self-stretch pt-3">
      {keyStores.map((ks) => (
        <Link key={ks.id} href={`/keyStore/${ks.id}`}>
          <div
            className={cx(
              "mb-3 flex w-full cursor-pointer justify-between rounded-s border border-transparent px-3 py-[10px] text-second-color",
              currentId === String(ks.id) && "ks-link-active",
            )}
          >
            {ks.name}

            <ChevronRight className="h-4 w-4" />
          </div>
        </Link>
      ))}
    </div>
  );
}
