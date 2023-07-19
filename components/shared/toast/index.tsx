import { Children, ReactNode, useState } from "react";
import { Copy } from "lucide-react";
import * as ToastPrimitive from "@radix-ui/react-toast";

import "./index.css";

export default function Toast({ title, open, setOpen, children }: any) {
  return (
    <ToastPrimitive.Provider>
      {children}
      <ToastPrimitive.Root
        className="ToastRoot"
        open={open}
        onOpenChange={setOpen}
      >
        {title && (
          <ToastPrimitive.Title className="ToastTitle">
            {title}
          </ToastPrimitive.Title>
        )}
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport className="ToastViewport" />
    </ToastPrimitive.Provider>
  );
}
