import TopBar from "@/components/layout/top-bar";
import Sidebar from "@/components/layout/sidebar";

import NetworkProvider from "@/lib/providers/network-provider";
import TokenProvider from "@/lib/providers/token-provider";
import UserEndPointProvider from "@/lib/providers/user-end-point-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full items-stretch">
      <div className="flex h-full grow flex-col">
        <TopBar />
        <UserEndPointProvider>
          <NetworkProvider>
            <TokenProvider>{children}</TokenProvider>
          </NetworkProvider>
        </UserEndPointProvider>
      </div>

      <Sidebar />
    </div>
  );
}
