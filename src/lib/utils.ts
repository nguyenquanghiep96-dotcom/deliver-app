import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanStopType(type: string): string {
  if (!type) return "";
  return type.split(/[-—]/)[0]?.trim() || type;
}

