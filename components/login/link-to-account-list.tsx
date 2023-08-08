import { ChevronLeft } from "lucide-react";

export default function LinkToAccountList({ onShow }: { onShow: () => void }) {
  return (
    <div
      className="absolute top-[-40px] flex select-none items-center hover:cursor-pointer md:top-[-3.8em]"
      onClick={onShow}
    >
      <ChevronLeft className="mr-2 h-4 w-4" />
      <span className="text-primary">Account List</span>
    </div>
  );
}
