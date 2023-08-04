import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function TestTxResult(props: {
  result: Record<string, any>;
  open: boolean;
  onOpenChange: (_o: boolean) => void;
}) {
  const { result, ...reset } = props;

  return (
    <Dialog {...reset}>
      <DialogContent className="w-[600px]">
        <DialogHeader>
          <DialogTitle>Test Tx</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <div className="text-sm text-content-color">transaction_hash</div>
            <div className="break-all">
              {result?.signed_message?.transaction_hash}
            </div>
          </div>
          <div>
            <div className="text-sm text-content-color">estimate_gas</div>
            <div>{Number(result?.gas)}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
