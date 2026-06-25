/**
 * Instance time utilities — Punto 2.
 *
 * Two distinct concerns live here, kept separate on purpose:
 *
 *  A) CONFIGURED-TIMEZONE "now": deciding what "today / next Friday / upcoming"
 *     is for the COMMUNITY, and formatting display/email stamps. These depend on
 *     the instance's timezone, derived from the configured city/country
 *     (platformSettings.ciudad + pais -> KNOWN_CITIES -> IANA). They must NOT
 *     use the raw server clock.
 *
 *  B) CALENDAR-DATE math (add/subtract days on a "YYYY-MM-DD"): a calendar date
 *     has no time and no zone, so this is done with UTC arithmetic and is
 *     timezone-INDEPENDENT. Used to keep saved order dates from drifting by the
 *     server timezone (the residual of Hallazgo #1b).
 *
 * See also [[shabbatWindow]] which derives the Friday/Saturday window.
 */

import { getLocationByCity } from "@/app/services/geoLocationService";

/**
 * Single fallback timezone, used when the configured city/country is not mapped
 * in KNOWN_CITIES. Centralized here so it is the ONE place to change (previously
 * emails assumed 'America/Panama' and shabbatTimesApi assumed 'Asia/Jerusalem').
 */
export const DEFAULT_TIMEZONE = 'America/Panama';

/**
 * Resolve the instance's IANA timezone from platform settings.
 * @param {Object} platformSettings - Strapi platform-setting (has ciudad, pais).
 * @returns {string} IANA timezone, e.g. 'America/Panama'. Falls back to DEFAULT_TIMEZONE.
 */
export function getInstanceTimezone(platformSettings) {
  const location = getLocationByCity(platformSettings?.ciudad, platformSettings?.pais);
  return location?.timezone || DEFAULT_TIMEZONE;
}

const WEEKDAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/**
 * (A) Calendar parts of an instant AS SEEN in a given timezone.
 * @param {Date|string|number} [date] - instant (defaults to now).
 * @param {string} [timeZone] - IANA timezone.
 * @returns {{year:number, month:number, day:number, weekday:number}} month is 1-12, weekday 0=Sun.
 */
export function getDatePartsInTimezone(date = new Date(), timeZone = DEFAULT_TIMEZONE) {
  const instant = date instanceof Date ? date : new Date(date);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).formatToParts(instant);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  return {
    year: parseInt(get('year'), 10),
    month: parseInt(get('month'), 10),
    day: parseInt(get('day'), 10),
    weekday: WEEKDAY_INDEX[get('weekday')],
  };
}

const pad2 = (n) => String(n).padStart(2, '0');

/**
 * (A) "Today" in the configured timezone, as "YYYY-MM-DD".
 * @param {string} [timeZone] - IANA timezone.
 */
export function getTodayISO(timeZone = DEFAULT_TIMEZONE) {
  const { year, month, day } = getDatePartsInTimezone(new Date(), timeZone);
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

/**
 * (B) Add (or subtract) whole days to a "YYYY-MM-DD" string. Timezone-INDEPENDENT
 * (UTC arithmetic). Tolerates a full ISO input by using only its date part.
 * @param {string} isoDate - "YYYY-MM-DD" (or ISO with time).
 * @param {number} days - days to add (may be negative).
 * @returns {string|null} "YYYY-MM-DD", or null on invalid input.
 */
export function addDaysISO(isoDate, days) {
  if (!isoDate || typeof isoDate !== 'string') return null;
  const m = isoDate.split('T')[0].match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const d = new Date(Date.UTC(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10)));
  d.setUTCDate(d.getUTCDate() + days);
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

/**
 * (B) Format a "YYYY-MM-DD" date string as "DD/MM/YYYY" for display.
 * Timezone-INDEPENDENT (pure string), so a calendar date never drifts when shown
 * (unlike `new Date(str).toLocaleDateString()`, which renders in the viewer's zone).
 * @param {string} isoDate - "YYYY-MM-DD" (or ISO with time).
 * @returns {string} "DD/MM/YYYY", or '' on invalid input.
 */
export function formatISODateDMY(isoDate) {
  if (!isoDate || typeof isoDate !== 'string') return '';
  const m = isoDate.split('T')[0].match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
}

/**
 * (A) Next Friday (>= today) in the configured timezone, as "YYYY-MM-DD".
 * Replaces server-clock `new Date()` + getDay() "next Friday" defaults.
 * @param {string} [timeZone] - IANA timezone.
 */
export function getNextFridayISO(timeZone = DEFAULT_TIMEZONE) {
  const { year, month, day, weekday } = getDatePartsInTimezone(new Date(), timeZone);
  const todayISO = `${year}-${pad2(month)}-${pad2(day)}`;
  const daysUntilFriday = (5 - weekday + 7) % 7; // 0 if today is Friday
  return addDaysISO(todayISO, daysUntilFriday);
}
