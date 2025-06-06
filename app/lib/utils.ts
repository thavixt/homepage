import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"
import type { BackgroundChangeFrequency, BackgroundSettings } from "~/reducers/settingsReducer";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBackgroundSeed(settings: Record<"background", BackgroundSettings>) {
  const backgroundChangeFrequency = settings.background.value;
  const seedFixedParts = [ settings.background.counter, new Date().getFullYear() ]
  const seedVariableParts: Record<BackgroundChangeFrequency, string> = {
    monthly: new Date().getMonth().toString(),
    weekly: (new Date().getDate() % 7).toString(),
    daily: new Date().getDate().toString(),
    hourly: new Date().getHours().toString(),
  }

  switch (backgroundChangeFrequency) {
    case "monthly":
      seedVariableParts.weekly = '*';
      seedVariableParts.daily = '*';
      seedVariableParts.hourly = '*';
      break;
    case "weekly":
      seedVariableParts.daily = '*';
      seedVariableParts.hourly = '*';
      break;
    case "daily":
      seedVariableParts.hourly = '*';
      break;
    case "hourly":
      break;
  }

  return [...seedFixedParts,...Object.values(seedVariableParts)].join('-')
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

export function importDataFromJson<T extends Record<string, ExportableValue>>(
  transform: (item: T) => void,
  onSuccess: string = "Data imported from file successfully",
  onError: string = "An error happened trying to import from a file",
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
      const importedItems = JSON.parse(text);
      if (!Array.isArray(importedItems)) {
        throw new Error('Invalid import format');
      }
      importedItems.forEach(item => {
        transform(item);
      });
      toast.success(onSuccess);
    } catch (error) {
      toast.error(`${onError}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    document.body.removeChild(input);
  };

  document.body.appendChild(input);
  input.click();
}
