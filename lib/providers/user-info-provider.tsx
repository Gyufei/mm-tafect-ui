"use client";

import { createContext, useEffect, useRef } from "react";
import useSWR from "swr";

import fetcher from "@/lib/fetcher";
import { SystemEndPointPathMap } from "../end-point";
import useIndexStore from "../state";

interface UserInfoContext {
  refreshUser: () => void;
}

export const UserInfoContext = createContext<UserInfoContext>({
  refreshUser: () => {},
});

export default function UserInfoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const activeUser = useIndexStore((state) => state.activeUser());
  const addOrUpdateUser = useIndexStore((state) => state.addOrUpdateUser);

  const { data: userInfoData, mutate: refreshUserAction } = useSWR(
    SystemEndPointPathMap.userInfo,
    fetcher,
  );

  const refreshUser = () => {
    hasRender.current = false;
    refreshUserAction();
  };

  const hasRender = useRef(false);

  useEffect(() => {
    if (hasRender.current) return;
    if (!activeUser || !userInfoData) return;
    if (activeUser.email !== userInfoData.username) return;

    const newUser = {
      ...activeUser,
      ...userInfoData,
    };

    hasRender.current = true;

    addOrUpdateUser(newUser);
  }, [userInfoData, activeUser, addOrUpdateUser]);

  return (
    <UserInfoContext.Provider
      value={{
        refreshUser,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
}
