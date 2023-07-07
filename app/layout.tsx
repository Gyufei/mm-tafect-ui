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
  metadataBase: new URL("https://precedent.vercel.app/"),
  themeColor: "#FFF",
};

import { getCurrentUser } from "@/lib/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLogin = getCurrentUser();

  return (
    <html lang="en">
      <body
        className={cx(
          chesna.variable,
          inter.variable,
          "w-full",
          "min-h-screen",
        )}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
