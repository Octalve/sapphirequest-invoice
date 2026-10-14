import { MONTHS_3 } from "../constants";

export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function pad4(value: number): string {
  return String(value).padStart(4, "0");
}

export function parseStrictDisplayedDate(day: string, month: string, year: string): Date | null {
  const y = Number.parseInt(year, 10);
  const d = Number.parseInt(day, 10);
  const monthIndex = MONTHS_3.indexOf(month.toUpperCase().trim() as (typeof MONTHS_3)[number]);

  if (!Number.isFinite(y) || !Number.isFinite(d) || monthIndex < 0) return null;

  const date = new Date(y, monthIndex, d);
  const valid =
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === y &&
    date.getMonth() === monthIndex &&
    date.getDate() === d;

  return valid ? date : null;
}

export function datePartsFromDate(date: Date): Pick<
  import("../types").InvoiceDraft,
  "day" | "month" | "year"
> {
  return {
    day: pad2(date.getDate()),
    month: MONTHS_3[date.getMonth()] ?? "JAN",
    year: String(date.getFullYear()),
  };
}
