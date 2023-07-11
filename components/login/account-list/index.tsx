import { Trash2 } from "lucide-react";

import "./index.css";
import { IAccount } from "@/lib/types";
import { useState } from "react";

interface AcProps {
  selectAccountCb: (ac: IAccount) => void;
}
export default function AccountList(props: AcProps) {
  const [accounts, updateAccounts] = useState<Array<IAccount>>([
    {
      name: "abc",
      email: "123@qq.com",
    },
    {
      name: "abc1",
      email: "123a@qq.com",
    },
    {
      name: "abc2",
      email: "125a@qq.com",
    },
  ]);

  const handleDelete = (ac: IAccount) => {
    const newAccounts = accounts.filter((item) => item.email !== ac.email);
    updateAccounts(newAccounts);
  };

  const AccountCard = (ac: IAccount) => {
    return (
      <div
        className="mr-4  flex w-[420px] cursor-pointer justify-start rounded border border-border-color bg-white p-4 hover:bg-slate-50"
        onClick={() => props.selectAccountCb(ac)}
        key={ac.email}
      >
        <div className="mr-4 h-10 w-10 rounded-lg border border-border-color bg-white"></div>
        <div className="flex flex-col items-start justify-between">
          <div className="text-base font-bold leading-4 text-title-color">
            {ac.name}
          </div>
          <div className="text-base leading-4 text-second-color">
            {ac.email}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="account-list max-w-md">
      <div className="mb-4 text-lg font-bold text-title-color">
        Pick up one account
      </div>
      <div>
        {accounts.map((ac) => {
          return (
            <div key={ac.email} className="mb-5 flex items-center">
              <AccountCard {...ac} />
              <Trash2
                className="cursor-pointer hover:text-primary"
                onClick={() => handleDelete(ac)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
