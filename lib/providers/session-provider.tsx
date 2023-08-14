"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export default function SessionWrapProvider({
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
