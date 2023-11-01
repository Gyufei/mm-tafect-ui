import { isAfter } from "date-fns";

export interface IUser {
  name: string;
  email: string;
  token: string;
  expires: number;
  active: boolean;
  image?: string | null;

  timezone?: string;
  username?: string;
  id?: string;
  endpoint?: string;
  aliasname?: string;
}

export function checkUserIsValid(user: IUser | null): boolean {
  if (!user) return false;

  return user?.expires ? isAfter(user?.expires, new Date()) : false;
}
