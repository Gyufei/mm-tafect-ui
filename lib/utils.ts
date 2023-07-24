import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const displayText = (
  text: string,
  start: number = 8,
  end: number = 6,
) => {
  if (text.length <= start + end) {
    return text;
  } else {
    return text.slice(0, start) + "..." + text.slice(-end);
  }
};
