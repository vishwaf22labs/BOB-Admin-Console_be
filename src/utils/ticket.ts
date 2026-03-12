export function generateTicketId(year: number, count: number): string {
  return `BOB-${year}-${String(count).padStart(5, "0")}`;
}