import { checkIsLogin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function App() {
  const isLogin = checkIsLogin();

  if (isLogin) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }

  return <></>;
}
