export function getDateString(date = new Date) {
  return normalizeDate(date).toISOString();
}

export function getTimeString(date = new Date) {
  return date.toTimeString().split(' ')[0]
}

export function normalizeDate(date: Date) {
  const d = new Date(date);
  d.setHours(12);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0);

  return d;
}

export function isToday(date: Date) {
  const d = normalizeDate(new Date(date))
    .toISOString()
    .split('T')[0];
  const today = normalizeDate(new Date())
    .toISOString()
    .split('T')[0];
  
  return d === today;
}