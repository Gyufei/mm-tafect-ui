import { TopBar } from "@/components/layout/top-bar";

import Web3Provider from "@/lib/providers/web3-provider";
import Sidebar from "@/components/layout/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full items-stretch">
      <div className="flex h-full grow flex-col">
        <TopBar />
        <Web3Provider>{children}</Web3Provider>
      </div>

      <Sidebar />
    </div>
  );
}
