import { Suspense } from "react";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { getServerSession } from "next-auth/next";

import "./globals.css";
import { chesna, inter } from "./fonts";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import SessionContext from "@/lib/providers/SessionContext";
import SWRContext from "@/lib/providers/SWRContext";

export const metadata: Metadata = {
  title: "mm-tafect-ui",
  description: "mm-tafect-ui",
  twitter: {
    card: "summary_large_image",
    title: "Precedent - Building blocks for your Next.js project",
    description:
      "Precedent is the all-in-one solution for your Next.js project. It includes a design system, authentication, analytics, and more.",
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
    <html lang="en" className={cn(chesna.variable, inter.variable)}>
      <body className="h-screen w-full overflow-y-hidden">
        <Suspense fallback="Loading">
          <SessionContext session={session}>
            <SWRContext>{children}</SWRContext>
          </SessionContext>
        </Suspense>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
