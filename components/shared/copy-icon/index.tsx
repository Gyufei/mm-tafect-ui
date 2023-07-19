import { useState } from "react";
import { Copy } from "lucide-react";
import Toast from "@/components/shared/toast";

export default function CopyIcon({ text }: { text: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const [open, setOpen] = useState(false);

  return (
    <Toast title="Copied!" open={open} setOpen={setOpen}>
      <Copy
        onClick={() => {
          handleCopy();
          setOpen(true);
          console.log("copied");
        }}
        className="ml-1 h-4 w-4 cursor-pointer text-[#8c8c8c] hover:text-primary"
      />
    </Toast>
  );
}
