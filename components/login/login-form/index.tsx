import { IAccount } from "@/lib/types";

import "./index.css";
import { LinkOfAccount } from "./linkOfAccount";

export default function LoginForm(props: { account: IAccount }) {
  return (
    <div className="login-form flex w-full max-w-md grow flex-col items-stretch">
      <div className="relative flex w-full flex-col">
        <LinkOfAccount />
      </div>
    </div>
  );
}
