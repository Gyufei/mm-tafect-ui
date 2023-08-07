"use client";

import { useCallback, useState } from "react";
import { IUser } from "@/lib/types/user";

import LoginForm from "@/components/login/login-form";
import AccountList from "@/components/login/account-list";
import AuthRedirect from "@/components/shared/auth-redirect";

export default function Login() {
  const [showAccountList, setShowAccountList] = useState(false);

  const [currentSelectedAccount, setCurrentSelectedAccount] =
    useState<IUser | null>(null);

  const handleSelectAccount = useCallback((account: IUser) => {
    setCurrentSelectedAccount(account);
    setShowAccountList(false);
  }, []);

  const handleShowAccountList = useCallback(() => {
    setShowAccountList(true);
  }, []);

  return (
    <div className="flex w-full grow flex-col items-start px-4 md:max-w-md md:p-0">
      <AuthRedirect />
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
