import localFont from "next/font/local";
import { Inter } from "next/font/google";

export const chesna = localFont({
  src: [
    {
      path: "./chesna-grotesk-300.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./chesna-grotesk-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./chesna-grotesk-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./chesna-grotesk-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./chesna-grotesk-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-chesna",
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
