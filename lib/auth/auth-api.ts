import fetcher from "../fetcher";
import { SystemEndPointPathMap } from "../end-point";
import { toast } from "@/components/ui/use-toast";
import { IUser } from "./user";
import {
  addOrUpdateUser,
  removeOldStorage,
} from "./local-user-storage";

export async function signInAction(credentials: {
  username: string;
  password: string;
}) {
  removeOldStorage();

  try {
    const res = await fetcher(
      SystemEndPointPathMap.login,
      {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" },
      },
      true,
    );

    const { access_token } = res;

    const user: IUser = {
      name: credentials.username.split("@")[0],
      email: credentials.username,
      token: access_token,
      expires: new Date().getTime() + 1000 * 60 * 60 * 24,
      active: true,
    };

    addOrUpdateUser(user);

    return true;
  } catch (e: any) {
    toast({
      variant: "destructive",
      title: `Api: login`,
      description: `${e.status}: ${e.info}`,
    });

    return false;
  }
}