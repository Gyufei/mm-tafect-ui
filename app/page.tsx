"use client"
import { checkIsLogin } from "@/lib/auth";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export default function App() {
  const isLogin = checkIsLogin();

  // if (isLogin) {
  //   redirect("/dashboard");
  // } else {
  //   redirect("/login");
  // }

  return (
    <>
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
