"use client";

import useSWR from "swr";
import { sortBy } from "lodash";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { PenLine, Trash2 } from "lucide-react";

import KeyStoreLinks from "@/components/key-store/key-store-links";

import { SystemEndPointPathMap } from "@/lib/end-point";
import fetcher from "@/lib/fetcher";

import { KeyStorePageSelect } from "@/components/key-store/key-store-page-select";
import DetailItem from "@/components/shared/detail-item";
import KeyStoreAccountsTable, {
  IAccountGas,
} from "@/components/key-store/key-store-accounts-table";
import { NetworkContext } from "@/lib/providers/network-provider";
import { UserEndPointContext } from "@/lib/providers/user-end-point-provider";
import DeleteKeyStoreDialog from "@/components/key-store/delete-key-store-dialog";
import { IKeyStore, IKeyStoreRange } from "@/lib/types/keystore";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import useSWRMutation from "swr/mutation";
import { useUserKeystores } from "@/lib/hooks/use-user-keystores";

export default function KeyStoreItem() {
  const { userPathMap } = useContext(UserEndPointContext);
  const { network } = useContext(NetworkContext);

  const [selectedKeyStore, setSelectedKeyStore] = useState<IKeyStore | null>(
    null,
  );
  const [selectedRange, setSelectedRange] = useState<IKeyStoreRange | null>(
    null,
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const { data: userKeyStores, mutate: refetchKeyStores } = useUserKeystores();

  const firstRenderSetSelect = useRef(false);

  useEffect(() => {
    if (!userKeyStores.length) {
      setSelectedKeyStore(null);
    }

    if (
      userKeyStores.length &&
      !selectedKeyStore &&
      !firstRenderSetSelect.current
    ) {
      setSelectedKeyStore(userKeyStores[0]);
      firstRenderSetSelect.current = true;
    }

    if (selectedKeyStore) {
      const newKs = userKeyStores.find(
        (k: IKeyStore) => k.keystore_name === selectedKeyStore.keystore_name,
      );
      if (newKs) setSelectedKeyStore(newKs);
    }

    if (selectedRange) {
      const newRange = selectedKeyStore?.range.find(
        (r: IKeyStoreRange) => r.root_account === selectedRange.root_account,
      );
      if (newRange) setSelectedRange(newRange);
    }
  }, [userKeyStores, selectedKeyStore, selectedRange]);

  const { data: keyStoreAccountsData, mutate: refreshAccount } = useSWR(() => {
    if (userKeyStores.length && selectedKeyStore && network?.chain_id) {
      return `${userPathMap.keyStoreAccounts}?keystore=${selectedKeyStore.keystore_name}&chain_id=${network?.chain_id}`;
    } else {
      return null;
    }
  }, fetcher);

  const accounts: Array<IAccountGas> = useMemo(() => {
    if (!userKeyStores || !keyStoreAccountsData || !selectedKeyStore) return [];

    let targetAcc = [];
    if (selectedKeyStore && !selectedRange) {
      targetAcc = keyStoreAccountsData.reduce(
        (acc: Array<IAccountGas>, k: Record<string, any>) => {
          return acc.concat(k.accounts);
        },
        [],
      );
    }

    if (selectedKeyStore && selectedRange) {
      const rootIndex = selectedKeyStore.range.findIndex(
        (r: IKeyStoreRange) => {
          return r.root_account === selectedRange.root_account;
        },
      );
      targetAcc = keyStoreAccountsData[rootIndex]?.accounts || [];
    }

    return sortBy(targetAcc, "gas").reverse();
  }, [userKeyStores, keyStoreAccountsData, selectedKeyStore, selectedRange]);

  const accountCount: number = accounts.length;

  const tx = accounts.reduce(
    (acc: number, aG: Record<string, any>) => acc + aG.tx,
    0,
  );

  const gasAvailable = accounts.filter(
    (aG: Record<string, any>) => aG.gas > 0,
  ).length;

  const submitFetcher = async (url: string, { arg }: { arg: IKeyStore }) => {
    const res = await fetcher(url, {
      method: "POST",
      body: JSON.stringify(arg),
    });

    toast({
      description: "Update KeyStore Success",
    });
    return res;
  };

  const { trigger: submitAction } = useSWRMutation(
    SystemEndPointPathMap.addKeyStore,
    submitFetcher as any,
  );

  const [edit, setEdit] = useState<"from" | "to" | null>(null);

  const [fromValue, setFromValue] = useState<string | null>(null);
  const [toValue, setToValue] = useState<string | null>(null);
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);

  const onEdit = (type: "from" | "to") => {
    if (type === "from") {
      setFromValue(String(selectedRange?.from_index) || null);
      fromRef.current?.select();
      fromRef.current?.focus();
    }

    if (type === "to") {
      setToValue(String(selectedRange?.to_index) || null);
      toRef.current?.select();
      toRef.current?.focus();
    }

    setEdit(type);
  };

  const onFromBlur = () => {
    if (!fromValue) {
      setFromValue(String(selectedRange?.from_index) || null);
      setEdit(null);
      return;
    }

    updateKeyStoreRange();
  };

  const onToBlur = () => {
    if (!toValue) {
      setToValue(String(selectedRange?.to_index) || null);
      setEdit(null);
      return;
    }

    updateKeyStoreRange();
  };

  const onFromChange = (val: string) => {
    setFromValue(val || null);
  };

  const onToChange = (val: string) => {
    setToValue(val || null);
  };

  const updateKeyStoreRange = async () => {
    if (!selectedKeyStore) return;

    const res = await submitAction({
      keystore_name: selectedKeyStore.keystore_name,
      range: JSON.stringify([
        ...selectedKeyStore.range.filter(
          (r: IKeyStoreRange) => r.root_account !== selectedRange?.root_account,
        ),
        {
          root_account: selectedRange?.root_account,
          from_index: parseInt(fromValue || "0"),
          to_index: parseInt(toValue || "0"),
        },
      ]),
    } as any);

    if (res) {
      refetchKeyStores();
      refreshAccount();
      setEdit(null);
    }
  };

  const onDelete = () => {
    setSelectedKeyStore(null);
    setSelectedRange(null);
    refetchKeyStores();
  };

  return (
    <>
      <KeyStoreLinks
        keyStores={userKeyStores}
        selected={selectedKeyStore}
        setSelected={setSelectedKeyStore}
        selectedRange={selectedRange}
        setSelectedRange={setSelectedRange}
        onSubmitted={() => refetchKeyStores()}
        onDelete={() => setDeleteDialogOpen(true)}
      ></KeyStoreLinks>
      <div className="flex min-h-[400px] flex-1 flex-col items-stretch overflow-y-auto bg-[#fafafa] md:flex-row md:overflow-y-hidden">
        <div className="flex w-full flex-col justify-between border-b border-shadow-color px-3 pb-4 pt-3 md:w-[400px] md:border-b-0 md:border-r">
          <div className="flex flex-col justify-stretch">
            <DetailItem title="Address">{accountCount}</DetailItem>
            <DetailItem title="Gas Available">{gasAvailable}</DetailItem>
            <DetailItem title="Tx">{tx}</DetailItem>
            <DetailItem title="Default Network">
              {network?.network_name}
            </DetailItem>
            {!selectedRange && (
              <DetailItem title="Works for">
                {selectedKeyStore ? (
                  <KeyStorePageSelect
                    keyStoreName={selectedKeyStore?.keystore_name || null}
                  />
                ) : (
                  <div className="h-6 w-10"></div>
                )}
              </DetailItem>
            )}
            {selectedRange && (
              <div className="flex items-center justify-between">
                <DetailItem title="From" className="flex-1">
                  <div className="flex items-center gap-x-3">
                    {edit === "from" ? (
                      <Input
                        // data-state={errorMsg ? "error" : ""}
                        ref={fromRef}
                        type="text"
                        value={fromValue || ""}
                        placeholder="0"
                        onBlur={onFromBlur}
                        onChange={(e) => onFromChange(e.target.value)}
                        className="h-6 focus-visible:ring-0 data-[state=error]:border-destructive"
                      />
                    ) : (
                      <span className="leading-6">
                        {selectedRange.from_index}
                      </span>
                    )}
                    <PenLine
                      onClick={() => onEdit("from")}
                      className="h-4 w-4 cursor-pointer text-[8c8c8c]"
                    />
                  </div>
                </DetailItem>
                <div className="mx-[3px]">-</div>
                <DetailItem title="To" className="flex-1">
                  <div className="flex items-center gap-x-3">
                    {edit === "to" ? (
                      <Input
                        // data-state={errorMsg ? "error" : ""}
                        ref={toRef}
                        type="text"
                        value={toValue || ""}
                        placeholder="0"
                        onBlur={onToBlur}
                        onChange={(e) => onToChange(e.target.value)}
                        className="h-6 focus-visible:ring-0 data-[state=error]:border-destructive"
                      />
                    ) : (
                      <span className="leading-6">
                        {selectedRange.to_index}
                      </span>
                    )}
                    <PenLine
                      onClick={() => onEdit("to")}
                      className="h-4 w-4 cursor-pointer text-[8c8c8c]"
                    />
                  </div>
                </DetailItem>
              </div>
            )}
          </div>

          <div className="hidden w-full justify-end pr-2 md:flex">
            {!selectedRange && (
              <Trash2
                onClick={() => setDeleteDialogOpen(true)}
                className="h-5 w-5 cursor-pointer hover:text-[#ec5b55]"
              />
            )}
            <DeleteKeyStoreDialog
              open={deleteDialogOpen}
              keyStoreName={selectedKeyStore?.keystore_name || null}
              onOpenChange={setDeleteDialogOpen}
              onDeleted={onDelete}
            />
          </div>
        </div>

        <KeyStoreAccountsTable accounts={accounts} />
      </div>
    </>
  );
}
