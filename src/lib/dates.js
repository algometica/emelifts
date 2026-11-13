export function toDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function startOfWeek(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

export function weekDays(anchor = new Date()) {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    return {
      date: day,
      key: toDateKey(day),
      label: day.toLocaleDateString('en-CA', { weekday: 'short' }),
      dayNum: day.getDate(),
    };
  });
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function lastDays(n, end = new Date()) {
  return Array.from({ length: n }, (_, i) => {
    const day = addDays(end, i - (n - 1));
    return {
      date: day,
      key: toDateKey(day),
      label: day.toLocaleDateString('en-CA', { weekday: 'narrow' }),
      dayNum: day.getDate(),
    };
  });
}

export function streakFrom(keys, endKey) {
  const set = new Set(keys);
  let cursor = parseDateKey(endKey);
  if (!set.has(endKey)) cursor = addDays(cursor, -1);
  let count = 0;
  while (set.has(toDateKey(cursor))) {
    count += 1;
    cursor = addDays(cursor, -1);
  }
  return count;
}

export function formatLongDate(key) {
  return parseDateKey(key).toLocaleDateString('en-CA', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
