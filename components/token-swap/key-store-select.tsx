import { useContext, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  IKeyStoreAccount,
  useKeyStoreAccounts,
} from "@/lib/hooks/use-key-store-accounts";
import { NetworkContext } from "@/lib/providers/network-provider";

export default function KeyStoreSelect({
  keyStores,
  handleKeyStoreSelect,
}: {
  keyStores: Array<IKeyStoreAccount>;
  handleKeyStoreSelect: (
    _keyStoreUpdate:
      | Array<IKeyStoreAccount>
      | ((_ks: Array<IKeyStoreAccount>) => Array<IKeyStoreAccount>),
  ) => void;
}) {
  const { network } = useContext(NetworkContext);
  const networkId = network?.chain_id || null;

  const [openKeyStorePop, setKeyStorePop] = useState(false);

  const keyStoreOptions = useKeyStoreAccounts(networkId);

  useEffect(() => {
    if (!keyStores.length && keyStoreOptions.length) {
      handleKeyStoreSelect([keyStoreOptions[0]]);
    }
  }, [keyStoreOptions]);

  const handleSelectKeyStore = (keyStore: any) => {
    handleKeyStoreSelect((ks: Array<IKeyStoreAccount>) => {
      if (ks.some((k) => k.name === keyStore.name)) {
        return ks.filter((k) => k.name !== keyStore.name);
      } else {
        return [...ks, keyStore];
      }
    });
    setKeyStorePop(false);
  };

  return (
    <Popover
      open={openKeyStorePop}
      onOpenChange={(isOpen) => setKeyStorePop(isOpen)}
    >
      <PopoverTrigger className="w-[350px]">
        <div
          className="flex items-center transition-all duration-75 active:bg-gray-100"
          onClick={() => setKeyStorePop(!openKeyStorePop)}
        >
          {keyStores.length ? (
            <>
              <div className="mr-2 text-title-color">{keyStores[0].name}</div>
              <div className="Tag mr-2 bg-[#e9eaee]">{keyStores.length}</div>
            </>
          ) : (
            <div className="text-sm text-content-color">Select KeyStore</div>
          )}
          <ChevronDown
            className={`h-4 w-4 text-gray-600 transition-all ${
              openKeyStorePop ? "rotate-180" : ""
            }`}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[360px]" align="start">
        <div className="w-[340px] rounded-md bg-white">
          <div className="flex flex-col">
            <div className="LabelText mb-1 flex items-center">
              Available KeyStores
            </div>
            <div className="flex flex-wrap">
              {keyStoreOptions.map((option) => (
                <div
                  key={option.name}
                  className="flex w-[160px] cursor-pointer items-center"
                >
                  <Checkbox
                    id={option.name}
                    checked={keyStores.some((ks) => ks.name === option.name)}
                    onCheckedChange={() => handleSelectKeyStore(option)}
                  />
                  <label
                    className="flex cursor-pointer items-center pl-2 text-lg font-medium text-title-color"
                    htmlFor={option.name}
                  >
                    {option.name}
                    <div className="Tag ml-2 bg-[#e9eaee]">
                      {option.accounts.length}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
