export type DesignerCalendarCell = {
  key: string;
  day?: number;
  isEvent?: boolean;
};

/** Parse YYYY-MM-DD as a local calendar date (stable vs ISO date-only UTC quirks). */
export function parseEventDateLocal(dateText: string): Date | null {
  const trimmed = dateText.trim();
  if (!trimmed) return null;
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(trimmed);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) return null;
  const dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  return dt;
}

/** Leading blanks + days 1…last for the month of `eventDate`; `isEvent` matches that day only. */
export function buildDesignerCalendarCells(eventDate: Date): DesignerCalendarCell[] {
  const year = eventDate.getFullYear();
  const month = eventDate.getMonth();
  const eventDay = eventDate.getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const cells: DesignerCalendarCell[] = [];
  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push({ key: `blank-${year}-${month}-${i}` });
  }
  for (let day = 1; day <= lastDay; day += 1) {
    cells.push({
      key: `day-${year}-${month}-${day}`,
      day,
      isEvent: day === eventDay,
    });
  }
  return cells;
}
