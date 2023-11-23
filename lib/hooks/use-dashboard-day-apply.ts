import { useState } from "react";
import useIndexStore from "../state";
import fetcher from "../fetcher";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

export function useDashboardDayApply() {
  const userPathMap = useIndexStore((state) => state.userPathMap());
  const selectedDay = useIndexStore((state) => state.selectedDay);

  const [applyLoading, setApplyLoading] = useState(false);

  const applyAction = async () => {
    const date = format(selectedDay, "yyyy-MM-dd");
    const applyUrl = userPathMap.scheduleApply;

    const params = {
      schedule_date: date,
      status: false,
    };
    if (!applyUrl || !params) return;
    setApplyLoading(true);

    const res = await fetcher(applyUrl, {
      method: "POST",
      body: JSON.stringify(params),
    });
    setApplyLoading(false);

    const isFailed = res.msg.includes("Failed");
    toast({
      variant: isFailed ? "destructive" : "default",
      title: res.msg,
    });

    return res;
  };

  return {
    applyLoading,
    applyAction,
  };
}
