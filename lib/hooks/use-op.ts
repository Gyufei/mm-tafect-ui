import { useContext, useMemo, useState } from "react";
import { IOp } from "../types/op";
import { UserEndPointContext } from "../providers/user-end-point-provider";

export function useOp() {
  const { userPathMap } = useContext(UserEndPointContext);
  const [op, setOp] = useState<IOp | null>(null);

  const isApproveOp = useMemo(() => op?.op_id === 3, [op]);
  const isTransferOp = useMemo(() => op?.op_id === 2, [op]);
  const isSwapOp = useMemo(() => op?.op_id === 1, [op]);

  const opSignUrl = useMemo(() => getSignUrl(), [op]);
  const opSendUrl = useMemo(() => getSendUrl(), [op]);
  const opApproveSendUrl = useMemo(
    () => userPathMap.sendApprove,
    [userPathMap],
  );

  function getSignUrl() {
    if (isApproveOp) return userPathMap.signApprove;
    if (isTransferOp) return userPathMap.signTransfer;
    if (isSwapOp) return userPathMap.signSwap;
  }

  function getSendUrl() {
    if (isApproveOp) return userPathMap.sendApprove;
    if (isTransferOp) return userPathMap.sendTransfer;
    if (isSwapOp) return userPathMap.sendSwap;
  }

  return {
    op,
    setOp,
    opSignUrl,
    opSendUrl,
    opApproveSendUrl,
    isApproveOp,
    isTransferOp,
    isSwapOp,
  };
}
