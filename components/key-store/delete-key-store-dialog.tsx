import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoadingIcon from "@/components/shared/loading-icon";
import { SystemEndPointPathMap } from "@/lib/end-point";
import fetcher from "@/lib/fetcher";
import useSWRMutation from "swr/mutation";

export default function DeleteKeyStoreDialog({
  keyStoreName,
  open,
  onOpenChange,
  onDeleted,
}: {
  keyStoreName: string | null;
  open: boolean;
  onOpenChange: (_val: boolean) => void;
  onDeleted: () => void;
}) {
  const deleteFetcher = async () => {
    if (!keyStoreName) return null;

    const params = {
      keystore_name: keyStoreName,
    };

    const res = await fetcher(SystemEndPointPathMap.deleteKeyStore, {
      method: "POST",
      body: JSON.stringify(params),
    });

    onDeleted();
    onOpenChange(false);

    return res;
  };

  const { isMutating: deleting, trigger: deleteMutate } = useSWRMutation(
    SystemEndPointPathMap.deleteKeyStore,
    deleteFetcher,
  );

  return (
    <Dialog open={open} onOpenChange={(val) => onOpenChange(val)}>
      <DialogContent className="w-[320px]">
        <div className="flex flex-col justify-center">
          <div className="flex justify-center text-2xl text-title-color">
            Title
          </div>
          <div className="mb-5 mt-2 text-center text-base">
            {`Are you sure to delete "${keyStoreName}" ?`}
          </div>
          <Button
            variant="destructive"
            disabled={deleting}
            className="mb-2 flex items-center rounded-md shadow-none"
            onClick={() => deleteMutate()}
          >
            <LoadingIcon isLoading={deleting} />
            Yes
          </Button>
          <Button
            className="rounded-md"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            No
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
