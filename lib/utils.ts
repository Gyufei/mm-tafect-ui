import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AddressRegex } from "./constants/global";
import numbro from "numbro";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toNonExponential(num: number | string) {
  if (typeof num === "string") {
    if (Number.isNaN(Number.parseFloat(num))) return num;
    if (!num.includes("e")) return num;
    num = Number.parseFloat(num);
  }
  if (typeof num !== "number") return num;
  if (!String(num).includes("e")) return String(num);

  const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/) || [];
  const fixedDig = Math.max(0, (m[1]?.length || 0) - Number(m[2]));

  return num.toFixed(fixedDig);
}

export function isAddress(address: string): boolean {
  return AddressRegex.test(address);
}

export function parseToAddress(v: string) {
  if (v && !v.startsWith("0")) return "";
  if (v.length > 1 && !v.startsWith("0x") && !v.startsWith("0X")) return "0";
  if (v.length > 42) return v.substring(0, 42);

  return v.replace(/[^0-9a-fA-FxX]/g, "");
}

export function formatPercentNum(num: number | string) {
  return numbro(num).format({
    trimMantissa: true,
    mantissa: 2,
  });
}
