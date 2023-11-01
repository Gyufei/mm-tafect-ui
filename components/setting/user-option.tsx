"use client";
import useEffectStore from "@/lib/state/use-store";
import DetailItem from "../shared/detail-item";
import EditEndPoint from "./edit-end-point";

import ChangeTimezone from "./timezone";
import useIndexStore from "@/lib/state";
import EditAliasname from "./edit-aliasname";

export default function UserOption() {
  const activeUser = useEffectStore(useIndexStore, (state) =>
    state.activeUser(),
  );

  return (
    <div className="flex flex-1 flex-col justify-stretch">
      <DetailItem title="Email Address">{activeUser?.email || ""}</DetailItem>
      <EditEndPoint />
      <EditAliasname />
      <ChangeTimezone />
    </div>
  );
}
