"use client";

import { AuthRedirect } from "@/lib/auth";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function App() {
  AuthRedirect();

  return <></>;
}
