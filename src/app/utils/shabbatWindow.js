/**
 * Single source of truth for deriving the Shabbat weekend window from Hebcal's
 * parashat date.
 *
 * Hebcal returns a parashat's `date` as the SATURDAY (the Shabbat day). The
 * weekend reservation window is [Friday, Saturday], so the Friday is the
 * Saturday minus one day.
 *
 * IMPORTANT — why this does NOT use `new Date(str).getDate()`:
 * a `"YYYY-MM-DD"` string is parsed as UTC midnight, but `.getDate()` reads it
 * in the server's local time. West of UTC that rolls the day back by one, which
 * is exactly the kind of off-by-one we are fixing. A parashat date is a pure
 * calendar date (no time, no zone), so the subtraction is done with `Date.UTC`
 * arithmetic and read back with `getUTC*` — deterministic on any server.
 *
 * @param {string} hebcalSaturdayDate - Hebcal's Saturday date, "YYYY-MM-DD" or a
 *   full ISO string (e.g. the fallback path emits "...T..Z"); only the date part
 *   is used.
 * @param {Object} [options] - Reserved for Punto 2 (timezone hardening).
 * @param {string} [options.timezone] - IANA timezone from the instance location
 *   config. Currently IGNORED (the calendar subtraction is timezone-independent);
 *   accepted now so Punto 2 can anchor time→date conversions without changing
 *   this signature or any caller.
 * @returns {{ friday: string, saturday: string, formatted: string } | null}
 *   `friday`/`saturday` as "YYYY-MM-DD"; `formatted` as "DD-DD/MM/YYYY" using the
 *   Saturday's month/year (round-trip compatible with extractDateRange, including
 *   the month-boundary case e.g. "31-01/09/2025"). Returns null on invalid input.
 */
export function getShabbatWindow(hebcalSaturdayDate, options = {}) {
  // options.timezone is intentionally unused in Punto 1. Kept for Punto 2.
  void options;

  if (!hebcalSaturdayDate || typeof hebcalSaturdayDate !== 'string') {
    return null;
  }

  // Take only the date part so a full ISO string ("2025-09-20T00:00:00Z") works.
  const datePart = hebcalSaturdayDate.split('T')[0];
  const match = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const satYear = parseInt(match[1], 10);
  const satMonth = parseInt(match[2], 10); // 1-12
  const satDay = parseInt(match[3], 10);

  // Friday = Saturday - 1 day, via UTC arithmetic (no local-time drift).
  const fridayUTC = new Date(Date.UTC(satYear, satMonth - 1, satDay));
  fridayUTC.setUTCDate(fridayUTC.getUTCDate() - 1);

  const friYear = fridayUTC.getUTCFullYear();
  const friMonth = fridayUTC.getUTCMonth() + 1; // 1-12
  const friDay = fridayUTC.getUTCDate();

  const pad = (n) => String(n).padStart(2, '0');

  const friday = `${friYear}-${pad(friMonth)}-${pad(friDay)}`;
  const saturday = `${satYear}-${pad(satMonth)}-${pad(satDay)}`;
  // Matches shabbatTimesApi formattedDate convention: Saturday's month/year.
  const formatted = `${pad(friDay)}-${pad(satDay)}/${pad(satMonth)}/${satYear}`;

  return { friday, saturday, formatted };
}
