import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function LoadingIcon({
  isLoading,
  className,
}: {
  isLoading: boolean;
  className?: string;
}) {
  return (
    <>
      {isLoading && (
        <Loader2
          className={cn("mr-2 h-4 w-4 animate-spin text-primary", className)}
        />
      )}
    </>
  );
}
