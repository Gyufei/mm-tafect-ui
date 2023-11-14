import useIndexStore from "@/lib/state";
import useEffectStore from "@/lib/state/use-store";
import { ChevronLeft } from "lucide-react";

export default function LinkToAccountList({ onShow }: { onShow: () => void }) {
  const allUsers = useEffectStore(useIndexStore, (state) => state.users);

  return (
    <>
      {allUsers && allUsers?.length > 0 && (
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
