import { Children, ReactNode, useState } from "react";
import { Copy } from "lucide-react";
import * as ToastPrimitive from "@radix-ui/react-toast";

import "./index.css";

export default function Toast({ title, content, children }: any) {
  return (
    <ToastPrimitive.Provider>
      {children}
      <ToastPrimitive.Root className="ToastRoot">
        {title && (
          <ToastPrimitive.Title className="ToastTitle">
            {title}
          </ToastPrimitive.Title>
        )}

        <ToastPrimitive.Description>{content}</ToastPrimitive.Description>

        {/* <ToastPrimitive.Close aria-label="Close">
        <span aria-hidden>×</span>
      </ToastPrimitive.Close> */}
      </ToastPrimitive.Root>
    </ToastPrimitive.Provider>
  );
}
