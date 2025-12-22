import { toast } from "sonner";
import { asyncForEach } from "./utils";

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