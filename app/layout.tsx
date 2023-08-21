import { Suspense } from "react";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { getServerSession } from "next-auth/next";

import "./globals.css";
import { chesna, inter } from "./fonts";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import SessionWrapProvider from "@/lib/providers/session-provider";
import SWRConfigProvider from "@/lib/providers/swr-config-provider";
import MuiPickerProvider from "@/lib/providers/mui-picker-provider";

export const metadata: Metadata = {
  title: "mm-tafect-ui",
  description: "mm-tafect-ui",
  twitter: {
    card: "summary_large_image",
    title: "mm-tafect",
    description: "keystore manage tools",
    creator: "@steventey",
  },
  metadataBase: new URL("https://precedent.vercel.app/"),
  themeColor: "#FFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html
      lang="en"
      className={cn(chesna.variable, inter.variable, "h-full w-full")}
    >
      <body className="h-screen w-full overflow-x-hidden overflow-y-hidden md:overflow-x-auto">
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              Loading...
            </div>
          }
        >
          <SessionWrapProvider session={session}>
            <SWRConfigProvider>
              <MuiPickerProvider>{children}</MuiPickerProvider>
            </SWRConfigProvider>
          </SessionWrapProvider>
        </Suspense>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
