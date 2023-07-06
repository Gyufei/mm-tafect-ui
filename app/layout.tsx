import { Metadata } from "next";
import { Suspense } from "react";

import { Analytics } from "@vercel/analytics/react";
import cx from "classnames";

import { chesna, inter } from "./fonts";
import "./globals.css";

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
  metadataBase: new URL(""),
  themeColor: "#FFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cx(chesna.variable, inter.variable)}>
        <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
        <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
