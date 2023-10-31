"use client";

import { useEffect, useMemo } from "react";
import { redirect, usePathname } from "next/navigation";
import { isAfter } from "date-fns";
import useIndexStore from "@/lib/state";

const loginPath = "/login";
const Matcher = ["/dashboard", "/key-store", "/token-swap", "/setting"];

export default function AuthRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const activeUser = useIndexStore((state) => {
    return state.activeUser();
  });

  const pathname = usePathname();

  const isLogin = useMemo(() => {
    if (!activeUser?.token || !activeUser?.expires) return false;

    const isExpired = activeUser?.expires
      ? isAfter(activeUser?.expires, new Date())
      : false;

    return isExpired;
  }, [activeUser]);

  useEffect(() => {
    if (!isLogin) {
      if (pathname === "/" || Matcher.find((m) => pathname.includes(m))) {
        redirect(loginPath);
      }
    } else {
      if (pathname === "/") {
        redirect("/dashboard");
      }
    }
  }, [isLogin, pathname]);

  return <>{children}</>;
}
