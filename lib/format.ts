const monthYear = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-04" → "Apr 2026". Parsed as UTC so the build machine's timezone can't shift it. */
function formatMonthYear(value: string): string {
  const [year, month] = value.split("-").map(Number);
  return monthYear.format(new Date(Date.UTC(year, month - 1, 1)));
}

/**
 * Card / case-study period. A range renders as "Apr 2026 – Sep 2026"; a
 * single month renders on its own. Nothing implies "ongoing" — add an
 * explicit flag if that ever matters.
 */
export function formatPeriod(date?: string, endDate?: string): string | null {
  if (!date) return null;
  const start = formatMonthYear(date);
  return endDate ? `${start} – ${formatMonthYear(endDate)}` : start;
}
