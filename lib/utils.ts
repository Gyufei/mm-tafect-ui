import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
