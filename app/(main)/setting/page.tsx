import { getServerSession } from "next-auth";
import AvatarCard from "@/components/setting/avatar-card";
import ChangePassword from "@/components/setting/change-password";
import UserOption from "@/components/setting/user-option";

export default async function Setting() {
  const session = await getServerSession();
  const user = session?.user;

  return (
    <div className="flex w-full gap-x-6 px-24 py-5">
      <div className="flex flex-col">
        <AvatarCard user={user} />
        <ChangePassword />
      </div>

      <UserOption user={user} />
    </div>
  );
}
