import { UserManageContext } from "@/lib/providers/user-manage-provider";
import { ChevronLeft } from "lucide-react";
import { useContext } from "react";

export default function LinkToAccountList({ onShow }: { onShow: () => void }) {
  const { allUsers } = useContext(UserManageContext);

  return (
    <>
      {allUsers.length > 0 && (
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
