"use client";

import useSWR from "swr";
import { sortBy } from "lodash";
import { useContext, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import useSWRMutation from "swr/mutation";

import KeyStoreLinks from "@/components/key-store/key-store-links";

import { SystemEndPointPathMap } from "@/lib/end-point";
import fetcher from "@/lib/fetcher";

import { KeyStorePageSelect } from "@/components/key-store/key-store-page-select";
import DetailItem from "@/components/shared/detail-item";
import KeyStoreAccountsTable, {
  IAccountGas,
} from "@/components/key-store/key-store-accounts-table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoadingIcon from "@/components/shared/loading-icon";
import { NetworkContext } from "@/lib/providers/network-provider";
import { UserEndPointContext } from "@/lib/providers/user-end-point-provider";

export default function KeyStoreItem({ params }: { params: { item: string } }) {
  const keyStoreName = params.item;
  const { userPathMap } = useContext(UserEndPointContext);
  const { network } = useContext(NetworkContext);

  const { data: keyStoreAccountsData } = useSWR(() => {
    if (keyStoreName && network?.chain_id) {
      return `${userPathMap.keyStoreAccounts}?keystore=${keyStoreName}&chain_id=${network?.chain_id}`;
    } else {
      return null;
    }
  }, fetcher);

  const accounts: Array<IAccountGas> = useMemo(() => {
    if (keyStoreAccountsData?.[0].accounts) {
      const acc = sortBy(keyStoreAccountsData?.[0].accounts, "gas");
      return acc.reverse();
    }
    return [];
  }, [keyStoreAccountsData]);

  const accountCount: number = keyStoreAccountsData?.[0].count || 0;

  const tx = accounts.reduce(
    (acc: number, aG: Record<string, any>) => acc + aG.tx,
    0,
  );

  const gasAvailable = accounts.filter(
    (aG: Record<string, any>) => aG.gas > 0,
  ).length;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const deleteFetcher = async () => {
    const params = {
      keystore_name: keyStoreName,
    };

    const res = await fetcher(SystemEndPointPathMap.deleteKeyStore, {
      method: "POST",
      body: JSON.stringify(params),
    });

    setDeleteDialogOpen(false);

    return res;
  };

  const { isMutating: deleting, trigger: deleteMutate } = useSWRMutation(
    SystemEndPointPathMap.deleteKeyStore,
    deleteFetcher,
  );

  return (
    <>
      <KeyStoreLinks onDelete={() => setDeleteDialogOpen(true)}></KeyStoreLinks>
      <div className="flex min-h-[400px] flex-1 flex-col items-stretch overflow-y-auto bg-[#fafafa] md:flex-row md:overflow-y-hidden">
        <div className="flex w-full flex-col justify-between border-b border-shadow-color px-3 pb-4 pt-3 md:w-[400px] md:border-b-0 md:border-r">
          <div className="flex flex-col justify-stretch">
            <DetailItem title="Address">{accountCount}</DetailItem>
            <DetailItem title="Gas Available">{gasAvailable}</DetailItem>
            <DetailItem title="Tx">{tx}</DetailItem>
            <DetailItem title="Default Network">
              {network?.network_name}
            </DetailItem>
            <DetailItem title="Works for">
              <KeyStorePageSelect keyStoreName={keyStoreName} />
            </DetailItem>
          </div>
          <div className="hidden w-full justify-end pr-2 md:flex">
            <Trash2
              onClick={() => setDeleteDialogOpen(true)}
              className="h-5 w-5 cursor-pointer hover:text-[#ec5b55]"
            />
          </div>
        </div>

        <KeyStoreAccountsTable accounts={accounts} />
      </div>

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(val) => setDeleteDialogOpen(val)}
      >
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
              onClick={() => setDeleteDialogOpen(false)}
            >
              No
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
