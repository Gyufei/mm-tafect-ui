import React, { ForwardedRef, ReactNode, forwardRef } from "react";
import classnames from "classnames";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import "./index.css";

export const SelectItem = forwardRef(function Item(
  {
    children,
    className,
    ...props
  }: {
    children: ReactNode;
    className?: string;
    value: string;
    [key: string]: any;
  },
  forwardedRef: ForwardedRef<any>,
) {
  return (
    <SelectPrimitive.Item
      className={classnames(
        "SelectItem mb-1 flex select-none items-center rounded px-4 text-base",
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="SelectItemIndicator">
        <Check className="ml-1 h-[14px] w-[14px]" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
});

export default function Select({
  children,
  placeholder,
}: {
  children: ReactNode;
  placeholder?: string;
}) {
  return (
    <SelectPrimitive.Root>
      <SelectPrimitive.Trigger className="SelectTrigger flex w-full items-center justify-between rounded-md border border-border-color bg-white px-3 py-[9px]">
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon className="text-[#7d8998]">
          <ChevronDown />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className="SelectContent overflow-hidden rounded-md bg-white p-1">
          <SelectPrimitive.ScrollUpButton className="SelectScrollButton">
            <ChevronUp />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="SelectViewport">
            {children}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="SelectScrollButton">
            <ChevronDown />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
