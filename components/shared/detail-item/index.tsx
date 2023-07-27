import { ReactNode } from "react";

export default function DetailItem({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="bg-custom-bg-color mb-3 box-border flex flex-col rounded-md border border-border-color px-3 py-2">
      <div className="mb-1 text-sm font-normal text-content-color">{title}</div>
      {children}
    </div>
  );
}
