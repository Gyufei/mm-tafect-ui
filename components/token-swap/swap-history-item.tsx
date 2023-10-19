import { useContext } from "react";
import { ExternalLink } from "lucide-react";

import { ITask } from "@/lib/types/task";
import TruncateText from "@/components/shared/trunc-text";
import SwapHistoryItemStatus from "./swap-history-items-status";
import { NetworkContext } from "@/lib/providers/network-provider";
import { toNonExponential } from "@/lib/utils";
import { UserEndPointContext } from "@/lib/providers/user-end-point-provider";
import fetcher from "@/lib/fetcher";
import useSWRMutation from "swr/mutation";

export default function SwapHistoryItem({
  task,
  onCancel,
}: {
  task: ITask;
  onCancel: () => void;
}) {
  const { network } = useContext(NetworkContext);
  const { userPathMap } = useContext(UserEndPointContext);

  const isSwap = task.op === 1;
  // const isTransfer = task.op === 2;
  const isApprove = task.op === 3;
  const taskTxData = task.data;

  const handleGoToExplorer = () => {
    window.open(`${network?.block_explorer_url}/tx/${task.txHash}`);
  };

  const cancelFetcher = async () => {
    if (!task.id) return null;

    const res = await fetcher(
      `${userPathMap.cancelTask}?record_id=${task.id}`,
      {
        method: "POST",
        body: "",
      },
    );

    onCancel();
    return res;
  };

  const { trigger: cancelAction } = useSWRMutation(
    "Cancel Task",
    cancelFetcher,
  );

  const handleCancelQueue = () => {
    cancelAction();
  };

  return (
    <div className="flex flex-col gap-y-2 rounded-md border border-border-color bg-custom-bg-white p-3 first:mt-4">
      <div className="flex justify-between text-content-color">
        <div>{task.date}</div>
        <div className="flex items-center">
          [{isSwap ? `Swap ${task.opName}` : task.opName}]
          {isApprove ? `(${taskTxData.tokenName})` : null}
          {task.txHash && (
            <ExternalLink
              className="mb-1 ml-1 h-4 w-4 cursor-pointer text-primary"
              onClick={handleGoToExplorer}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between text-title-color">
        <div className="flex items-center text-lg font-medium">
          <TruncateText text={task.data.account} />
        </div>
        <div className="TruncateSingleLine max-w-[200px]">
          Gas:{" "}
          {toNonExponential((Number(taskTxData?.gas) || 0) / 10 ** 9) + " Gwei"}
        </div>
      </div>

      {!isApprove ? (
        <div className="flex justify-between text-content-color">
          <div>
            {taskTxData?.recipient !== taskTxData?.account && (
              <>
                Recipient: <TruncateText text={taskTxData?.recipient || ""} />
              </>
            )}
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
        <SwapHistoryItemStatus
          status={task.status}
          onCancelQueue={handleCancelQueue}
        />
        {!isApprove && <div>Nonce: {taskTxData?.nonce}</div>}
      </div>
    </div>
  );
}
