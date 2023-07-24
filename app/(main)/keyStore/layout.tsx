import { PlusCircle } from "lucide-react";

import KeyStoreLinks from "@/components/keyStore/keyStoreLinks";
import "./index.css";

async function getKeyStores() {
  const keyStores = [
    {
      id: 1,
      name: "bnb-keystore-1",
    },
    {
      id: 2,
      name: "bnb-keystore-2",
    },
  ];

  return keyStores;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const keyStores = await getKeyStores();

  return (
    <div className="flex h-full items-stretch bg-[#fafafa] pl-3">
      <div
        className="flex w-[284px] flex-col items-start justify-between bg-[#f4f5fa]"
        style={{
          boxShadow: "inset -1px 0px 0px 0px #d6d6d6",
        }}
      >
        <KeyStoreLinks keyStores={keyStores}></KeyStoreLinks>
        <div className="mb-3 w-full pr-3">
          <button className="flex w-full items-center justify-center rounded border border-primary bg-white py-2 text-base text-primary hover:bg-custom-bg-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Load KeyStore
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
