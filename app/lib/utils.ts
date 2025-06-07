import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"
import type { BackgroundChangeFrequency, BackgroundSettings } from "~/reducers/settingsReducer";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms = 250) {
  return new Promise(res => setTimeout(res, ms));
}

export async function asyncForEach<T>(
  items: Array<T>,
  callback: (item: T, index: number, totalCount: number) => void | Promise<void>,
  delayMs?: number,
) {
  for (let i = 0; i < items.length; i++) {
    callback(items[i], i, items.length);
    await sleep(delayMs);
  }
}

export function getBackgroundSeed(settings: Record<"background", BackgroundSettings>) {
  const backgroundChangeFrequency = settings.background.value;
  const seedFixedParts = [settings.background.counter, new Date().getFullYear()]
  const seedVariableParts: Record<BackgroundChangeFrequency, string> = {
    week: (new Date().getDate() % 7).toString(),
    day: new Date().getDate().toString(),
    hour: new Date().getHours().toString(),
    "30min": (new Date().getMinutes() % 30).toString(),
    "15min": (new Date().getMinutes() % 15).toString(),
    "5min": (new Date().getMinutes() % 5).toString(),
  }

  switch (backgroundChangeFrequency) {
    case "week":
      seedVariableParts.day = '*';
      seedVariableParts.hour = '*';
      seedVariableParts['5min'] = '*';
      seedVariableParts['15min'] = '*';
      seedVariableParts['30min'] = '*';
      break;
    case "day":
      seedVariableParts.hour = '*';
      seedVariableParts['5min'] = '*';
      seedVariableParts['15min'] = '*';
      seedVariableParts['30min'] = '*';
      break;
    case "hour":
      seedVariableParts['5min'] = '*';
      seedVariableParts['15min'] = '*';
      seedVariableParts['30min'] = '*';
      break;
    case "30min":
      seedVariableParts['15min'] = '*';
      seedVariableParts['30min'] = '*';
      break;
    case "15min":
      seedVariableParts['30min'] = '*';
      break;
    case "5min":
      break;
  }

  return [...seedFixedParts, ...Object.values(seedVariableParts)].join('-');
}

export function sortBy<T>(key: keyof T, arr: T[]): T[] {
  return arr.slice().sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.toLowerCase().localeCompare(bValue.toLowerCase(), navigator.language);
    }
    return 0;
  });
}

type ExportableValue = string | number | boolean;

export function exportDataToJson<T extends Record<string, ExportableValue>>(
  data: T[],
  filename: string = "data.json",
  onSuccess: string = "Data exported successfully",
  transform?: (item: T) => Partial<T>,
) {
  const items = transform ? data.map(transform) : data;
  if (items.length === 0) {
    toast.error('No data to export');
    return;
  }

  const dataStr = JSON.stringify(items, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.hidden = true;
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success(onSuccess);
}

export async function importDataFromJson<T extends Record<string, ExportableValue>>(
  callback: (item: T, i: number, totalCount: number) => void,
  onSuccess: (items: T[]) => void,
  onError?: (e: Error) => void,
) {
  const input = document.createElement('input');
  input.hidden = true;
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) {
      toast.error('No file selected');
      return;
    }
    try {
      const text = await file.text();
      const importedItems = JSON.parse(text) as T[];
      if (!Array.isArray(importedItems)) {
        throw new Error('Invalid import format');
      }
      await asyncForEach(importedItems, callback);
      onSuccess(importedItems);
    } catch (error) {
      toast.error(`${onError}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error(error as Error)
      onError?.(error as Error);
    }
    document.body.removeChild(input);
  };

  document.body.appendChild(input);
  input.click();
}
