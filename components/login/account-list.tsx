import { useState } from "react";
import { Trash2 } from "lucide-react";

import { IUser } from "@/lib/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useSwipeable } from "react-swipeable";
import useWindowSize from "@/lib/hooks/use-window-size";

export default function AccountList({
  onSelect,
}: {
  onSelect: (ac: IUser) => void;
}) {
  const [accounts, updateAccounts] = useState<Array<IUser>>([
    {
      name: "xiaoming",
      email: "xiaoming@163.com",
      image: null,
    },
    {
      name: "ipistr-eth",
      email: "ipistr-eth@ipilabs.com",
      image: null,
    },
    {
      name: "ipistr-bnb",
      email: "ipistr-bnb@ipilabs.com",
      image: null,
    },
  ]);

  const handleDelete = (ac: IUser) => {
    const newAccounts = accounts.filter((item) => item.email !== ac.email);
    updateAccounts(newAccounts);
  };

  return (
    <div className="w-full pt-20 md:max-w-md md:pt-[24vh]">
      <div className="mb-4 px-4 text-lg font-bold text-title-color">
        Pick up one account
      </div>

      {accounts.map((ac) => {
        return (
          <AccountCard
            key={ac.name}
            user={ac}
            onSelect={onSelect}
            onDelete={handleDelete}
          />
        );
      })}
    </div>
  );
}

const AccountCard = ({
  user: ac,
  onSelect,
  onDelete,
}: {
  user: IUser;
  onSelect: (_u: IUser) => void;
  onDelete: (_u: IUser) => void;
}) => {
  const swiperHandlers = useSwipeable({
    onSwipedLeft: (_e) => {
      if (isMobile) setShowTrash(true);
    },
    onSwipedRight: (_e) => {
      if (isMobile) setShowTrash(false);
    },
  });

  const [showTrash, setShowTrash] = useState(false);
  const { isMobile } = useWindowSize();

  const showTrashInMobile = isMobile && showTrash;

  return (
    <div className="mb-5 flex w-full items-center overflow-x-hidden px-4">
      <div
        style={{
          transform: showTrashInMobile ? "translateX(-60px)" : "translateX(0)",
        }}
        {...swiperHandlers}
        className="flex min-w-full cursor-pointer justify-start rounded border border-border-color bg-white p-4 hover:bg-slate-50 md:w-[420px] md:min-w-[auto]"
        onClick={() => onSelect(ac)}
      >
        <Avatar className="mr-4 h-10 w-10 rounded-lg">
          <AvatarImage src={ac.image || ""} />
          <AvatarFallback>{ac?.name?.[0] || ""}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start justify-between">
          <div className="text-base font-bold leading-4 text-title-color">
            {ac.name}
          </div>
          <div className="text-base leading-4 text-content-color">
            {ac.email}
          </div>
        </div>
      </div>
      {showTrashInMobile && (
        <div
          style={{
            transform: showTrashInMobile
              ? "translateX(-60px)"
              : "translateX(0)",
          }}
          className="ml-4 flex cursor-pointer items-center self-stretch rounded-md border-[#dea69c] bg-[#F8DEDA] px-2 animate-in slide-in-from-left duration-300"
        >
          <Trash2 className="hover:text-primary" onClick={() => onDelete(ac)} />
        </div>
      )}
      {!isMobile && (
        <Trash2
          className="ml-4 cursor-pointer hover:text-primary"
          onClick={() => onDelete(ac)}
        />
      )}
    </div>
  );
};
