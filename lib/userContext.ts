// lib/context.ts
import React from "react";

export interface IUser {
  name: string;
  email: string;
}

export interface IUserContextProps {
  isLoggedIn: boolean;
  user: {
    name: string;
    email: string;
  } | null;
  setUser?: (user: IUserContextProps["user"]) => void;
}

const MyContext = React.createContext<IUserContextProps>({
  isLoggedIn: false,
  user: null,
});

export default MyContext;
