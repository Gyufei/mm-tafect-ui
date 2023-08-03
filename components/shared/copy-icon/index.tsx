import { Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function CopyIcon({ text }: { text: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Copy
      onClick={() => {
        handleCopy();
        toast({
          description: "Copied to clipboard",
        });
      }}
      className="ml-1 h-4 w-4 cursor-pointer text-[#8c8c8c] hover:text-primary"
    />
  );
}
