"use client";

import { useEffect } from "react";

export default function GlobalInit({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (localStorage.getItem("version") === "1") return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userStorage");
    localStorage.removeItem("globalStorage");

    localStorage.setItem("version", "1");
  }, []);

  return <>{children}</>;
}
