import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimeInFormat(date: string) {
  const time = new Date(date).toLocaleTimeString();
  const formatedTime = time.split(":").reduce((acc: string, curr, index) => {
    if (index === 0) return acc + curr;
    if (index === 2) {
      return acc + " " + curr.split(" ")[1];
    }
    return acc + ":" + curr;
  }, "");
  return formatedTime;
}
