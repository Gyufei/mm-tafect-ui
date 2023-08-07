"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect, usePathname, useSearchParams } from "next/navigation";

export default function AuthRedirect() {
  const { status } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const loginPath = "/login";

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      if (pathname === loginPath || pathname === "/") {
        redirect(callbackUrl);
      }

      return;
    }
  }, [status, pathname, callbackUrl]);

  return null;
}
