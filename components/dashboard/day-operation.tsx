"use client";

import { useDashboardDayApply } from "@/lib/hooks/use-dashboard-day-apply";
import { Button } from "../ui/button";
import Empty from "../shared/empty";
import SwapHistoryItem from "../tokenswap/swap-history-item";

import Plan from "./plan";
import Rules from "./rules";
import { useDashboardDaySave } from "@/lib/hooks/use-dashboard-day-save";
import LoadingIcon from "../shared/loading-icon";
import { useDashboardReset } from "@/lib/hooks/use-dashboard-reset";
import { ITask } from "@/lib/types/task";

export default function DayOperation({
  tasks,
  onCancel,
}: {
  tasks: Array<ITask>;
  onCancel: () => void;
}) {
  const { saveLoading, saveAction } = useDashboardDaySave();
  const { applyLoading, applyAction } = useDashboardDayApply();
  const { resetAction } = useDashboardReset();

  return (
    <div className="w-[400px] border-l border-[#d6d6d6] bg-[#fafafa]">
      <div className="p-3 shadow-md">
        <Plan />
        <Rules />
        <div className="flex justify-between">
          <Button
            onClick={resetAction}
            className="w-[100px] border border-primary bg-white text-primary hover:brightness-95"
          >
            Reset
          </Button>
          <Button
            onClick={saveAction}
            disabled={saveLoading}
            className="w-[100px] border border-primary bg-white text-primary hover:brightness-95"
          >
            <LoadingIcon isLoading={saveLoading} />
            Save
          </Button>
          <Button
            onClick={applyAction}
            disabled={applyLoading}
            className="w-[152px] border border-primary bg-primary text-white hover:brightness-95"
          >
            <LoadingIcon className="text-white" isLoading={applyLoading} />
            Apply
          </Button>
        </div>
      </div>

      <div className="relative border-t">
        <div className="flex h-[calc(100vh-455px)] flex-col justify-stretch gap-y-3 overflow-y-auto px-3 pb-2">
          {tasks?.length ? (
            tasks.map((task) => (
              <SwapHistoryItem key={task.id} task={task} onCancel={onCancel} />
            ))
          ) : Array.isArray(tasks) ? (
            <Empty />
          ) : null}
        </div>
      </div>
    </div>
  );
}
