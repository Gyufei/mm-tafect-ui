import { IUser } from "@/lib/auth/user";
import useIndexStore from "@/lib/state";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function LinkToAccountList({ onShow }: { onShow: () => void }) {
  const allUsers = useIndexStore((state) => state.users);
  const [clientUsers, setClientUsers] = useState<IUser[]>([]);

  useEffect(() => {
    setClientUsers(allUsers);
  }, [allUsers]);

  return (
    <>
      {clientUsers.length > 0 && (
        <div
          className="absolute top-[-40px] flex select-none items-center hover:cursor-pointer md:top-[-3.8em]"
          onClick={onShow}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          <span className="text-primary">Account List</span>
        </div>
      )}
    </>
  );
}
