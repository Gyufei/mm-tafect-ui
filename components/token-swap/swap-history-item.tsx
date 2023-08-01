import { ITask } from "@/lib/types/task";
import TruncateText from "@/components/shared/trunc-text";
import SwapHistoryItemStatus from "./swap-history-items-status";

export default function SwapHistoryItem({ task }: { task: ITask }) {
  const isSwap = task.op === 1;
  const isTransfer = task.op === 2;
  const isApprove = task.op === 3;

  const taskTxData = task.data;

  return (
    <div className="flex flex-col gap-y-2 rounded-md border border-border-color bg-custom-bg-white p-3">
      <div className="flex justify-between text-content-color">
        <div>{task.date}</div>
        <div>
          [{isSwap ? `Swap ${task.opName}` : task.opName}]
          {isApprove ? `(${taskTxData.tokenName})` : null}
        </div>
      </div>
      <div className="flex justify-between text-title-color">
        <div className="text-lg font-medium ">
          <TruncateText text={task.txHash} />
        </div>
        <div className="TruncateSingleLine max-w-[200px]">
          Gas: {taskTxData?.gas}
        </div>
      </div>
      {isTransfer ? (
        <div className="flex justify-between text-content-color">
          <div>
            Recipient: <TruncateText text={taskTxData?.recipient || ""} />
          </div>
          <div className="TruncateSingleLine max-w-[200px]">
            Value: {taskTxData?.amount}
          </div>
        </div>
      ) : null}
      {isSwap ? (
        <div className="flex justify-between text-content-color">
          <div>
            {taskTxData.tokenInName}
            <span>&rarr;</span>
            {taskTxData.tokenOutName}
          </div>
          <div className="TruncateSingleLine max-w-[200px]">
            Amount: {taskTxData?.amount}
          </div>
        </div>
      ) : null}
      <div className="flex justify-between">
        <SwapHistoryItemStatus status={task.status} />
        {!isApprove && <div>Nonce: {taskTxData?.nonce}</div>}
      </div>
    </div>
  );
}
