"use client";

import useSWR from "swr";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import DeleteKeyStoreDialog from "@/components/key-store/delete-key-store-dialog";
import { IKeyStore, IKeyStoreRange } from "@/lib/types/keystore";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import useSWRMutation from "swr/mutation";
import { useUserKeystores } from "@/lib/hooks/use-user-keystores";
import { uniqBy } from "lodash";
import useIndexStore from "@/lib/state";

export default function KeyStoreItem() {
  const { network } = useContext(NetworkContext);
  const userPathMap  = useIndexStore((state) => state.userPathMap());

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const { data: userKeyStores, mutate: refetchKeyStores } = useUserKeystores();

  const [selectedKeyStoreName, setSelectedKeyStoreName] = useState<
    string | null
  >(null);
  const selectedKeyStore = useMemo(() => {
    if (!userKeyStores.length) return null;

    const ks = userKeyStores.find(
      (k: IKeyStore) => k.keystore_name === selectedKeyStoreName,
    );

    return ks;
  }, [userKeyStores, selectedKeyStoreName]);

  const [selectedRangeName, setSelectedRangeName] = useState<string | null>(
    null,
  );

  const selectedRange = useMemo(() => {
    if (!selectedKeyStoreName) return null;

    const ks = selectedKeyStore?.range.find(
      (k: IKeyStoreRange) => k.root_account === selectedRangeName,
    );

    return ks;
  }, [selectedKeyStoreName, selectedKeyStore, selectedRangeName]);

  useEffect(() => {
    if (!userKeyStores.length) {
      setSelectedKeyStoreName(null);
    }

    const hasKeyStore = userKeyStores.find(
      (ks) => ks.keystore_name === selectedKeyStoreName,
    );

    if (userKeyStores.length && (!selectedKeyStoreName || !hasKeyStore)) {
      setSelectedKeyStoreName(userKeyStores[0].keystore_name);
    }
  }, [userKeyStores, selectedKeyStoreName]);

  const { data: keyStoreAccountsDataRes, mutate: refreshAccount } = useSWR<
    Array<{ accounts: Array<IAccountGas>; count: number }>
  >(() => {
    if (userKeyStores.length && selectedKeyStoreName && network?.chain_id) {
      return `${userPathMap.keyStoreAccounts}?keystore=${selectedKeyStoreName}&chain_id=${network?.chain_id}`;
    } else {
      return null;
    }
  }, fetcher);

  const keyStoreAccountsData = useMemo(() => {
    if (!keyStoreAccountsDataRes) return [];

    return keyStoreAccountsDataRes?.map((ks) => {
      const indexedAccounts = ks.accounts.map((a, i) => ({
        ...a,
        index: i,
      }));

      return {
        ...ks,
        accounts: indexedAccounts,
      };
    });
  }, [keyStoreAccountsDataRes]);

  const getRangeAccounts = useCallback(
    (range: IKeyStoreRange) => {
      if (!keyStoreAccountsData) return [];

      const target =
        keyStoreAccountsData.find(
          (ks) => ks.accounts[0].account === range.root_account,
        )?.accounts || [];

      if (target?.length) {
        return target.slice(range.from_index, range.to_index + 1);
      }

      return target;
    },
    [keyStoreAccountsData],
  );

  const accounts: Array<IAccountGas> = useMemo(() => {
    if (!userKeyStores || !keyStoreAccountsData || !selectedKeyStore) return [];

    let targetAcc: Array<IAccountGas> = [];
    if (selectedKeyStore && !selectedRange) {
      targetAcc = selectedKeyStore.range.reduce(
        (acc: Array<IAccountGas>, k) => {
          const rangeAccounts = getRangeAccounts(k);
          return acc.concat(rangeAccounts);
        },
        [],
      );

      targetAcc = uniqBy(targetAcc, "index");
      // targetAcc = sortBy(uniqBy(targetAcc, "index"), "index");
    }

    if (selectedKeyStore && selectedRange) {
      targetAcc = getRangeAccounts(selectedRange);
    }

    return targetAcc;
  }, [
    userKeyStores,
    keyStoreAccountsData,
    selectedKeyStore,
    selectedRange,
    getRangeAccounts,
  ]);

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
          from_index: fromValue
            ? parseInt(fromValue)
            : selectedRange?.from_index,
          to_index: toValue ? parseInt(toValue) : selectedRange?.to_index,
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
    setSelectedKeyStoreName(null);
    setSelectedRangeName(null);
    refetchKeyStores();
  };

  return (
    <>
      <KeyStoreLinks
        keyStores={userKeyStores}
        selected={selectedKeyStoreName || null}
        setSelected={setSelectedKeyStoreName}
        selectedRange={selectedRangeName}
        setSelectedRange={setSelectedRangeName}
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
                {selectedKeyStoreName ? (
                  <KeyStorePageSelect
                    keyStoreName={selectedKeyStoreName || null}
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
              keyStoreName={selectedKeyStoreName || null}
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
