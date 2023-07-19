import { useState } from "react";
import { Copy } from "lucide-react";
import * as Toast from "@radix-ui/react-toast";

import "./index.css";

export default function CopyIcon({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Toast.Provider swipeDirection="right">
      <Copy
        onClick={() => {
          handleCopy();
          setOpen(true);
        }}
        className="ml-1 h-4 w-4 cursor-pointer text-[#8c8c8c] hover:text-primary"
      />

      <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
        <Toast.Title className="ToastTitle">Copied!</Toast.Title>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );
}
