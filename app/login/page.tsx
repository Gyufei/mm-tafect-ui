"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { IUser } from "@/lib/auth/user";

import LoginForm from "@/components/login/login-form";
import AccountList from "@/components/login/account-list";
import { UserManageContext } from "@/lib/providers/user-manage-provider";

export default function Login() {
  const { currentUser } = useContext(UserManageContext);
  const [showAccountList, setShowAccountList] = useState(false);
  const [showCurrentLoginFlag, setShowCurrentLoginFlag] = useState(true);

  const [currentSelectedAccount, setCurrentSelectedAccount] =
    useState<IUser | null>(currentUser);

  useEffect(() => {
    setCurrentSelectedAccount(currentUser);
  }, [currentUser]);

  const handleSelectAccount = useCallback((account: IUser) => {
    setCurrentSelectedAccount(account);
    setShowCurrentLoginFlag(true);
    setShowAccountList(false);
  }, []);

  const handleAddAccount = useCallback(() => {
    setShowAccountList(false);
    setShowCurrentLoginFlag(false);
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
          showCurrentLogin={showCurrentLoginFlag}
          showAccountCb={handleShowAccountList}
        />
      )}
    </div>
  );
}
