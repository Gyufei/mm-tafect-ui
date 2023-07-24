import { useState } from "react";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function CopyIcon({ text }: { text: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const { toast } = useToast();

  const [open, setOpen] = useState(false);

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
