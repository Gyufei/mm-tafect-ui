"use client";

import { SessionProvider } from "next-auth/react";
import useLocalStorage from "../hooks/use-local-storage";
import { useEffect } from "react";

export default function ThemeProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  useEffect(() => {
    if (session?.user?.image) {
      localStorage.setItem("token", session?.user?.image);
    }
  }, [session?.user?.image]);

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
