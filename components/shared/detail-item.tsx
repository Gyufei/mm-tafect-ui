import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function DetailItem({
  children,
  title,
  className,
}: {
  children: ReactNode;
  title: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-custom-bg-color mb-3 box-border flex flex-col rounded-md border border-border-color px-3 py-2",
        className,
      )}
    >
      <div className="mb-1 text-sm font-normal text-content-color">{title}</div>
      {children}
    </div>
  );
}
