"use client";

import { useContext, useEffect } from "react";
import { redirect, usePathname } from "next/navigation";
import { UserManageContext } from "@/lib/providers/user-manage-provider";

const loginPath = "/login";
const Matcher = ["/dashboard", "/key-store", "/token-swap", "/setting"];

export default function AuthRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, status } = useContext(UserManageContext);
  const pathname = usePathname();

  useEffect(() => {
    if (status !== "success") return;

    if (!currentUser) {
      if (pathname === "/" || Matcher.find((m) => pathname.includes(m))) {
        redirect(loginPath);
      }
    } else {
      if (pathname === "/") {
        redirect("/dashboard");
      }
    }
  }, [currentUser, pathname]);

  return <>{children}</>;
}
