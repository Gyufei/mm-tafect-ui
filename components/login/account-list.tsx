import { useContext, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { IUser } from "@/lib/auth/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useSwipeable } from "react-swipeable";
import { UserManageContext } from "@/lib/providers/user-manage-provider";
import { removeUser } from "@/lib/auth/local-user-storage";

export default function AccountList({
  onAdd,
  onSelect,
}: {
  onAdd: () => void;
  onSelect: (ac: IUser) => void;
}) {
  const { allUsers } = useContext(UserManageContext);

  const handleDelete = (ac: IUser) => {
    removeUser(ac.name);
  };

  const handleAdd = () => {
    onAdd();
  };

  return (
    <div className="w-full pt-20 md:max-w-md md:pt-[24vh]">
      <div className="mb-4 px-4 text-lg font-bold text-title-color">
        Pick up one account
      </div>

      {allUsers.map((ac) => {
        return (
          <AccountCard
            key={ac?.name}
            user={ac}
            onSelect={onSelect}
            onDelete={handleDelete}
          />
        );
      })}

      <div
        onClick={() => handleAdd()}
        className="ml-4 mr-10 flex min-w-full cursor-pointer justify-center rounded border border-border-color bg-white p-4 hover:bg-slate-50 md:w-[378px] md:min-w-[auto]"
      >
        <Plus></Plus>
      </div>
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
      setShowTrash(true);
    },
    onSwipedRight: (_e) => {
      setShowTrash(false);
    },
  });

  const [showTrash, setShowTrash] = useState(false);

  return (
    <div className="mb-5 flex w-full items-center overflow-x-hidden px-4">
      <div
        {...swiperHandlers}
        data-state={showTrash ? "show" : "hide"}
        className="flex min-w-full cursor-pointer justify-start rounded border border-border-color bg-white p-4 hover:bg-slate-50 data-[state=hide]:translate-x-0 data-[state=show]:-translate-x-16 md:w-[420px] md:min-w-[auto] md:translate-x-0"
        onClick={() => onSelect(ac)}
      >
        <Avatar className="mr-4 h-10 w-10 rounded-lg">
          <AvatarImage src={ac?.image || ""} />
          <AvatarFallback>{ac?.name?.[0] || ""}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start justify-between">
          <div className="text-base font-bold leading-4 text-title-color">
            {ac?.name}
          </div>
          <div className="text-base leading-4 text-content-color">
            {ac?.email}
          </div>
        </div>
      </div>
      <div
        data-state={showTrash ? "show" : "hide"}
        className=" ml-4 flex cursor-pointer items-center self-stretch rounded-md border-[#dea69c] bg-[#F8DEDA] px-2 slide-in-from-left data-[state=hide]:translate-x-0 data-[state=show]:-translate-x-16 data-[state=show]:animate-in md:hidden"
      >
        <Trash2 className="hover:text-primary" onClick={() => onDelete(ac)} />
      </div>
      <Trash2
        className="ml-4 hidden cursor-pointer hover:text-primary md:inline-block"
        onClick={() => onDelete(ac)}
      />
    </div>
  );
};
