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
      className={classnames("SelectItem", className)}
      {...props}
      ref={forwardedRef}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="SelectItemIndicator">
        <Check />
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
      <SelectPrimitive.Trigger className="SelectTrigger" aria-label="Food">
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon className="SelectIcon">
          <ChevronDown />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className="SelectContent">
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
