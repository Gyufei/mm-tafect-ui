import { useState } from "react";
import { Trash2 } from "lucide-react";

import "./index.css";
import { IUser } from "@/lib/types/user";
import UserAvatar from "@/components/shared/UserAvatar";

interface AcProps {
  selectAccountCb: (ac: IUser) => void;
}
export default function AccountList(props: AcProps) {
  const [accounts, updateAccounts] = useState<Array<IUser>>([
    {
      name: "abc",
      email: "123@qq.com",
      avatar:
        "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80",
    },
    {
      name: "abc1",
      email: "123a@qq.com",
      avatar:
        "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80",
    },
    {
      name: "abc2",
      email: "125a@qq.com",
      avatar:
        "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80",
    },
  ]);

  const handleDelete = (ac: IUser) => {
    const newAccounts = accounts.filter((item) => item.email !== ac.email);
    updateAccounts(newAccounts);
  };

  const AccountCard = (ac: IUser) => {
    return (
      <div
        className="mr-4  flex w-[420px] cursor-pointer justify-start rounded border border-border-color bg-white p-4 hover:bg-slate-50"
        onClick={() => props.selectAccountCb(ac)}
        key={ac.email}
      >
        <UserAvatar
          className="mr-4 h-10 w-10 rounded-lg"
          src={ac.avatar}
          userName={ac.name}
        />
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
