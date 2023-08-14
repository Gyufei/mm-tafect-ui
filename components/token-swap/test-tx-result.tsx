import { Dialog, DialogContent } from "@/components/ui/dialog";

export function TestTxResult(props: {
  result: Record<string, any>;
  open: boolean;
  onOpenChange: (_o: boolean) => void;
}) {
  const { result, ...reset } = props;

  return (
    <Dialog {...reset}>
      <DialogContent title="Text Tx" showClose={true} className="md:w-[600px]">
        <div className="grid gap-4 px-5">
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
