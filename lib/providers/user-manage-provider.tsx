"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { IUser } from "../auth/user";
import {
  UserStorageChangeEvent,
  getLocalUsers,
  getUserActive,
} from "../auth/local-user-storage";
import useBus from "../hooks/use-bus";

export type IUserLoginStatus = "loading" | "error" | "success";
interface IUsersContext {
  status?: IUserLoginStatus;
  currentUser: IUser | null;
  allUsers: Array<IUser>;
}

export const UserManageContext = createContext<IUsersContext>({
  currentUser: null,
  status: "loading",
  allUsers: [],
});

export default function UserManageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<IUserLoginStatus>("loading");
  const [allUsers, setAllUsers] = useState<Array<IUser>>([]);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const getUserAction = useCallback(() => {
    const all = getLocalUsers();
    const user = getUserActive() || null;
    setCurrentUser(user);
    setAllUsers(all);
    setStatus("success");
  }, []);

  useEffect(() => {
    getUserAction();
  }, [getUserAction]);

  useBus(UserStorageChangeEvent, getUserAction);

  return (
    <UserManageContext.Provider
      key={currentUser?.name}
      value={{
        allUsers,
        currentUser,
        status,
      }}
    >
      {children}
    </UserManageContext.Provider>
  );
}
