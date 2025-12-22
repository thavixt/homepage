import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms = 500) {
  return new Promise(res => setTimeout(res, ms));
}

export const noop = (..._: unknown[]) => { return void 0; };

export async function asyncForEach<T>(
  items: Array<T>,
  callback: (item: T, index: number, totalCount: number) => void | Promise<void>,
  delayMs = 150,
) {
  for (let i = 0; i < items.length; i++) {
    callback(items[i], i, items.length);
    await sleep(delayMs);
  }
}

export function sortArray<T>(arr: T[]): T[] {
  return arr.slice().sort((a, b) => {
    if (typeof a === "string" && typeof b === "string") {
      return a.toLowerCase().localeCompare(b.toLowerCase(), navigator.language);
    }
    return 0;
  });
}

export function sortArrayOfObjectsBy<T>(key: keyof T, arr: T[]): T[] {
  return arr.slice().sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.toLowerCase().localeCompare(bValue.toLowerCase(), navigator.language);
    }
    return 0;
  });
}
