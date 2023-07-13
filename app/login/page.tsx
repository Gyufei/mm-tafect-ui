"use client";

import { useCallback, useState } from "react";

import { IUser } from "@/lib/userContext";

import LoginForm from "@/components/login/login-form";
import AccountList from "@/components/login/account-list";
import { checkIsLogin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function Login() {
  const isLogin = checkIsLogin();

  if (isLogin) {
    redirect("/dashboard");
  }

  const [showAccountList, setShowAccountList] = useState(false);

  const [currentSelectedAccount, setCurrentSelectedAccount] =
    useState<IUser>({
      name: "",
      email: "",
    });

  const handleSelectAccount = useCallback((account: IUser) => {
    setCurrentSelectedAccount(account);
    setShowAccountList(false);
  }, []);

  const handleShowAccountList = useCallback(() => {
    setShowAccountList(true);
  }, []);

  return (
    <div className="mr-16 flex w-full max-w-md grow flex-col items-start p-0">
      {showAccountList ? (
        <AccountList selectAccountCb={handleSelectAccount} />
      ) : (
        <LoginForm
          account={currentSelectedAccount}
          showAccountCb={handleShowAccountList}
        />
      )}
    </div>
  );
}
