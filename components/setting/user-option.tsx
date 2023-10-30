"use client";
import DetailItem from "../shared/detail-item";
import EditEndPoint from "./edit-end-point";

import { UserManageContext } from "@/lib/providers/user-manage-provider";
import { useContext } from "react";
import ChangeTimezone from "./timezone";

export default function UserOption() {
  const { currentUser: user } = useContext(UserManageContext);

  return (
    <div className="flex flex-1 flex-col justify-stretch">
      <DetailItem title="Email Address">{user?.email || ""}</DetailItem>
      <EditEndPoint />
      <ChangeTimezone />
    </div>
  );
}
