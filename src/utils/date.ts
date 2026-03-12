export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function isOlderThan(date: Date, days: number): boolean {
  const threshold = addDays(date, days).getTime();
  return Date.now() > threshold;
}