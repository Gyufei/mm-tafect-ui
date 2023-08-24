import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { formatDistance, isAfter } from "date-fns";
import { IUser } from "@/lib/auth/user";

export default function SessionTip({
  className,
  user,
}: {
  className?: string;
  user: IUser | null;
}) {
  const now = new Date().getTime();

  const isAfterTime = user?.expires ? isAfter(user?.expires, now) : false;

  const formattedDifference = useMemo(() => {
    if (!isAfterTime || !user?.expires) return null;
    return formatDistance(user?.expires, now, { addSuffix: true });
  }, [now, user?.expires, isAfterTime]);

  return (
    <>
      {isAfterTime && (
        <div
          className={cn(
            className,
            "mt-5 rounded border border-[#DFCA9C] bg-[#FEFAF4] px-4 py-3 text-title-color md:mb-5 md:w-[420px]",
          )}
        >
          Your session ended after {formattedDifference} of inactivity.
        </div>
      )}
    </>
  );
}
