"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";

export function AuthRedirect() {
  const { status } = useSession();
  const pathname = usePathname();
  const loginPath = "/login";

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      if (pathname !== loginPath) {
        redirect(loginPath);
      }
      return;
    }

    if (status === "authenticated") {
      if (pathname === loginPath || pathname === "/") {
        redirect("/dashboard");
      }

      return;
    }
  }, [status, pathname]);

  return null;
}
