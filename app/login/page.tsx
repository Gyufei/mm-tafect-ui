"use client";

import { useCallback, useState } from "react";

import { IAccount } from "@/lib/types";

import LoginForm from "@/components/login/login-form";
import AccountList from "@/components/login/account-list";

export default async function Login() {
  const [showAccountList, setShowAccountList] = useState(false);

  const [currentSelectedAccount, setCurrentSelectedAccount] =
    useState<IAccount>({
      name: "",
      email: "",
    });

  const handleSelectAccount = useCallback((account: IAccount) => {
    setCurrentSelectedAccount(account);
    setShowAccountList(false);
  }, []);

  const handleShowAccountList = useCallback(() => {
    console.log(12322);
    // setShowAccountList(true);
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
