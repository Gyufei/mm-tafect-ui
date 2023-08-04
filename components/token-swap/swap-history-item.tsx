import { ITask } from "@/lib/types/task";
import TruncateText from "@/components/shared/trunc-text";
import SwapHistoryItemStatus from "./swap-history-items-status";
import { ExternalLink } from "lucide-react";
import { useContext } from "react";
import { Web3Context } from "@/lib/providers/web3-provider";

export default function SwapHistoryItem({ task }: { task: ITask }) {
  const { network } = useContext(Web3Context);
  const isSwap = task.op === 1;
  const isTransfer = task.op === 2;
  const isApprove = task.op === 3;

  const taskTxData = task.data;

  const handleGoToExploer = () => {
    window.open(`${network?.block_explorer_url}/tx/${task.txHash}`);
  };

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
        <div className="flex items-center text-lg font-medium">
          <TruncateText text={task.txHash} />
          <ExternalLink
            className="mb-1 ml-1 h-4 w-4 cursor-pointer text-primary"
            onClick={handleGoToExploer}
          />
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
