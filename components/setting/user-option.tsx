"use client";
import DetailItem from "../shared/detail-item";
import EditEndPoint from "./edit-end-point";

import ChangeTimezone from "./timezone";
import useIndexStore from "@/lib/state";

export default function UserOption() {
  const activeUser = useIndexStore((state) => state.activeUser());

  return (
    <div className="flex flex-1 flex-col justify-stretch">
      <DetailItem title="Email Address">{activeUser?.email || ""}</DetailItem>
      <EditEndPoint />
      <ChangeTimezone />
    </div>
  );
}
