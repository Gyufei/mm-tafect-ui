import { Suspense } from "react";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import cx from "classnames";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { chesna, inter } from "./fonts";
import "./globals.css";
import SessionContext from "@/lib/providers/SessionContext";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cx(chesna.variable, inter.variable)}>
      <body className="h-screen w-full overflow-y-hidden">
        <Suspense fallback="...">
          <SessionContext>{children}</SessionContext>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
