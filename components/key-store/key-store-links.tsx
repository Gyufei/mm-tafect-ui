"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronRight, PlusCircle, X } from "lucide-react";
import { LoadKeyStoreDialog } from "./load-key-store-dialog";
import { IKeyStore, IKeyStoreRange } from "@/lib/types/keystore";
import StakeIcon from "/public/icons/stake.svg";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import TruncateText from "../shared/trunc-text";

export default function KeyStoreLinks({
  keyStores,
  selected,
  setSelected,
  selectedRange,
  setSelectedRange,
  onDelete,
  onSubmitted,
}: {
  keyStores: Array<IKeyStore>;
  selectedRange: IKeyStoreRange | null;
  selected: IKeyStore | null;
  setSelected: (_s: IKeyStore | null) => void;
  setSelectedRange: (_s: IKeyStoreRange | null) => void;
  onDelete: () => void;
  onSubmitted: () => void;
}) {
  const [showLoadDialog, setLoadDialog] = useState(false);

  const handleSubmitLoad = () => {
    setLoadDialog(false);
    onSubmitted();
  };

  const [mapIsOpen, setMapIsOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const newMap = {} as any;
    keyStores.forEach((ks: IKeyStore) => {
      newMap[ks.id] = false;
    });
    setMapIsOpen(newMap);
  }, [keyStores]);

  const onOpenChange = (id: string) => {
    setMapIsOpen((prev) => {
      for (const key in prev) {
        if (key !== id) {
          prev[key] = false;
        }
      }

      return {
        ...prev,
        [id]: !prev[id],
      };
    });
  };

  const onSelectedKeyStore = (ks: IKeyStore) => {
    setSelected(ks);
    setSelectedRange(null);
  };

  const onSelectedRootAccount = (rAcc: IKeyStoreRange, ks: IKeyStore) => {
    setSelected(ks);
    setSelectedRange(rAcc);
  };

  return (
    <>
      <div className="flex w-full flex-row items-center justify-start overflow-x-auto border-b border-shadow-color bg-[#f4f5fa] px-3 py-2 md:w-[284px] md:flex-col md:items-start md:justify-between md:overflow-hidden md:border-r md:py-0 md:pl-3 md:pr-0">
        <div className="flex gap-x-3 md:flex-col md:self-stretch md:pt-3">
          {(keyStores || []).map((ks: IKeyStore) => (
            <Collapsible
              open={mapIsOpen[ks.id]}
              onOpenChange={() => onOpenChange(String(ks.id))}
              key={ks.id}
            >
              <div
                data-state={
                  !selectedRange &&
                  selected?.keystore_name === String(ks.keystore_name)
                    ? "active"
                    : "inactive"
                }
                onClick={() => onSelectedKeyStore(ks)}
                className="flex w-full cursor-pointer items-center justify-between rounded-full border px-3 py-[8px] text-content-color data-[state=active]:border-[#d7d9df] data-[state=active]:bg-[#e9eaee] data-[state=active]:text-[#000] md:rounded-e-none md:rounded-s md:border-r-0 md:border-transparent md:py-[10px]"
              >
                <div className="flex items-center">
                  <CollapsibleTrigger asChild>
                    <Image
                      src={StakeIcon}
                      width={24}
                      height={24}
                      className="mr-2 cursor-pointer"
                      alt="stake"
                    />
                  </CollapsibleTrigger>
                  <div>{ks.keystore_name}</div>
                </div>
                <ChevronRight className="hidden h-4 w-4 md:block" />
                <X
                  onClick={onDelete}
                  strokeWidth={3}
                  data-state={
                    selected?.keystore_name === String(ks)
                      ? "active"
                      : "inactive"
                  }
                  className="ml-3 hidden h-4 w-4 cursor-pointer rounded-full bg-border-color p-1 data-[state=active]:block md:data-[state=active]:hidden"
                />
              </div>
              <CollapsibleContent className="space-y-2">
                {ks.range.map((r: any) => (
                  <div
                    data-state={
                      selectedRange?.root_account === String(r.root_account)
                        ? "active"
                        : "inactive"
                    }
                    onClick={() => onSelectedRootAccount(r, ks)}
                    key={r.root_account}
                    className="ml-8 cursor-pointer border px-3 py-[8px] text-content-color data-[state=active]:border-[#d7d9df] data-[state=active]:bg-[#e9eaee] data-[state=active]:text-[#000] md:mb-3 md:rounded-e-none md:rounded-s md:border-r-0 md:border-transparent md:py-[10px]"
                  >
                    <TruncateText text={r.root_account} /> ({r.from_index || 0},
                    {r.to_index || ""})
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        <div className="ml-3 md:mb-3 md:ml-0 md:w-full md:pr-3">
          <button
            onClick={() => setLoadDialog(true)}
            className="flex items-center justify-center whitespace-nowrap rounded-full border border-primary bg-white px-3 py-2 text-base text-primary hover:bg-custom-bg-white md:w-full md:rounded md:px-0"
          >
            <PlusCircle className="mb-[2px] mr-2 h-4 w-4" />
            Load KeyStore
          </button>
        </div>
      </div>

      <LoadKeyStoreDialog
        show={showLoadDialog}
        setShow={setLoadDialog}
        onSubmitted={(_val: any) => handleSubmitLoad()}
      />
    </>
  );
}
