"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import LoginForm from "@/components/login/login-form";
import AccountList from "@/components/login/account-list";
import useIndexStore from "@/lib/state";
import { IUser, checkUserIsValid } from "@/lib/auth/user";
import useEffectStore from "@/lib/state/use-store";

export default function Login() {
  const router = useRouter();
  const activeUser = useEffectStore(useIndexStore, (state) =>
    state.activeUser(),
  );
  const setUserActive = useIndexStore((state) => state.setUserActive);
  const [showAccountList, setShowAccountList] = useState(false);
  const [showWithUserFlag, setShowWithUser] = useState(true);

  const [currentSelectedAccount, setCurrentSelectedAccount] =
    useState<IUser | null>(activeUser);

  const alreadyLogin = useMemo(() => {
    if (!activeUser) return false;
    if (!activeUser?.token) return false;

    const isExpired = checkUserIsValid(activeUser);

    return isExpired;
  }, [activeUser]);

  if (alreadyLogin && !showAccountList) {
    setShowAccountList(true);
  }

  const handleSelectAccount = useCallback((account: IUser) => {
    const isValid = checkUserIsValid(account);

    if (isValid) {
      setUserActive(account?.name || "");
      router.push("/dashboard");
    } else {
      setCurrentSelectedAccount(account);
      setShowWithUser(true);
      setShowAccountList(false);
    }
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
