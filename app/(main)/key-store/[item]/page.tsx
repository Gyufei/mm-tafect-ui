"use client";
import useSWR from "swr";
import { sortBy } from "lodash";
import { useContext, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";

import { PathMap } from "@/lib/path-map";
import fetcher from "@/lib/fetcher";

import { KeyStorePageSelect } from "@/components/key-store/key-store-page-select";
import DetailItem from "@/components/shared/detail-item";
import KeyStoreAccountsTable, {
  IAccountGas,
} from "@/components/key-store/key-store-accounts-table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useSWRMutation from "swr/mutation";
import LoadingIcon from "@/components/shared/loading-icon";
import { Web3Context } from "@/lib/providers/web3-provider";

export default function KeyStoreItem({ params }: { params: { item: string } }) {
  const keyStoreName = params.item;
  const { network } = useContext(Web3Context);

  const { data: keyStoreAccountsData } = useSWR(() => {
    if (keyStoreName) {
      return `${PathMap.keyStoreAccounts}?keystore=${keyStoreName}&chain_id=${network?.chain_id}`;
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

    const res = await fetcher(PathMap.deleteKeyStore, {
      method: "POST",
      body: JSON.stringify(params),
    });

    setDeleteDialogOpen(false);

    return res;
  };

  const { isMutating: deleting, trigger: deleteMutate } = useSWRMutation(
    PathMap.deleteKeyStore,
    deleteFetcher,
  );

  return (
    <div
      style={{ height: "calc(100vh - 70px)" }}
      className="flex min-h-[400px] flex-1 items-stretch bg-[#fafafa]"
    >
      <div
        className="ks-detail flex w-[400px] flex-col justify-between px-3 pb-4 pt-3"
        style={{
          boxShadow: "inset -1px 0px 0px 0px #d6d6d6",
        }}
      >
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
        <div className="flex w-full justify-end pr-2">
          <Trash2
            onClick={() => setDeleteDialogOpen(true)}
            className="h-5 w-5 cursor-pointer hover:text-[#ec5b55]"
          />
        </div>
      </div>

      <KeyStoreAccountsTable accounts={accounts} />

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
              variant="default"
              disabled={deleting}
              className="mb-2 flex items-center rounded-md shadow-none hover:border hover:border-primary hover:text-primary"
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
    </div>
  );
}
