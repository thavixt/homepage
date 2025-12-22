import type { SettingValueType } from "~/reducers/settingsReducer";

export function getMsByBackgroundSettingValue(value: SettingValueType<'background'>) {
  switch (value) {
    case "5min":
      return 5 * 60 * 1000; // 5 min in ms
    case "15min":
      return 15 * 60 * 1000; // 15 min in ms
    case "30min":
      return 30 * 60 * 1000; // 30 min in ms
    case "hour":
      return 60 * 60 * 1000; // 1 hour in ms
    case "day":
      return 24 * 60 * 60 * 1000; // 1 day in ms
    case "week":
      return 7 * 24 * 60 * 60 * 1000; // 1 week in ms
    default:
      return 24 * 60 * 60 * 1000; // fallback to 1 day
  }
}

export function getBackgroundSeed(
  backgroundChangeFrequency: SettingValueType<'background'>,
  counter: number,
) {
  const seedFixedParts = [counter, new Date().getFullYear()]
  const seedVariableParts: Record<SettingValueType<'background'>, string> = {
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