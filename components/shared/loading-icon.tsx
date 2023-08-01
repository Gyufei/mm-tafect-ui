import { Loader2 } from "lucide-react";

export default function LoadingIcon({ isLoading }: { isLoading: boolean }) {
  return (
    <>
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
      )}
    </>
  );
}
