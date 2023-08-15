import { IUser } from "@/lib/types/user";
import DetailItem from "../shared/detail-item";
import EditEndPoint from "./edit-end-point";

export default function UserOption({ user }: { user: IUser }) {
  return (
    <div className="flex flex-1 flex-col justify-stretch">
      <DetailItem title="Email Address">{user?.email || ""}</DetailItem>
      <EditEndPoint />
    </div>
  );
}
