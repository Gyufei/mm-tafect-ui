"use client";

import { useCallback, useEffect, useState } from "react";
import { IUser } from "@/lib/auth/user";

import LoginForm from "@/components/login/login-form";
import AccountList from "@/components/login/account-list";
import useIndexStore from "@/lib/state";

export default function Login() {
  const activeUser = useIndexStore((state) => state.activeUser);
  const [showAccountList, setShowAccountList] = useState(false);
  const [showWithUserFlag, setShowWithUser] = useState(true);

  const [currentSelectedAccount, setCurrentSelectedAccount] =
    useState<IUser | null>(activeUser);

  useEffect(() => {
    setCurrentSelectedAccount(activeUser);
  }, [activeUser]);

  const handleSelectAccount = useCallback((account: IUser) => {
    setCurrentSelectedAccount(account);
    setShowWithUser(true);
    setShowAccountList(false);
  }, []);

  const handleAddAccount = useCallback(() => {
    setShowAccountList(false);
    setShowWithUser(false);
  }, []);

  const handleShowAccountList = useCallback(() => {
    setShowAccountList(true);
  }, []);

  return (
    <div className="flex w-full grow flex-col items-start md:max-w-md">
      {showAccountList ? (
        <AccountList onSelect={handleSelectAccount} onAdd={handleAddAccount} />
      ) : (
        <LoginForm
          user={currentSelectedAccount}
          showWithUser={showWithUserFlag}
          showAccountCb={handleShowAccountList}
        />
      )}
    </div>
  );
}
