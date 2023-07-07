import { ChevronLeft } from "lucide-react";

export function LinkOfAccount() {
  return (
    <div className="link-account absolute flex items-center">
      <ChevronLeft className="w-4 h-4 mr-2" />
      <span className="text-primary hover:cursor-pointer">Account List</span>
    </div>
  );
}
