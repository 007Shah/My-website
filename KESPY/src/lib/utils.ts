import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(dateString: string) {
  try {
    const isIso = dateString.includes("T");
    const parseable = isIso ? dateString : dateString.replace(" ", "T") + "Z";
    return formatDistanceToNow(new Date(parseable), { addSuffix: true });
  } catch (err) {
    return "";
  }
}
