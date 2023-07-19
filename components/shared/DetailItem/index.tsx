import { ReactNode } from "react";
import "./index.css";

export function DetailItem({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="detail-item">
      <div className="detail-item-title">{title}</div>
      {children}
    </div>
  );
}
