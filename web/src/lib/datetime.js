// Shared date/time formatting helpers
// Standardizes display for ISO strings like "2025-09-26T14:08:08.705849Z"

/**
 * Parse various ISO-like strings safely, including those with fractional seconds.
 * Returns Date or null if invalid.
 */
export function parseISO(input) {
  if (!input) return null;
  try {
    // Some backends return microseconds; Date can handle them, but ensure string.
    const s = String(input);
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

/**
 * Format date-only as YYYY-MM-DD (default) or locale-aware string.
 * opts: { locale, dateStyle: 'short'|'medium'|'long'|'full'|undefined }
 */
export function formatDate(input, opts = {}) {
  const d = parseISO(input);
  if (!d) return '—';
  const { locale, dateStyle } = opts;
  if (dateStyle) {
    try {
      return new Intl.DateTimeFormat(locale || undefined, { dateStyle }).format(d);
    } catch {
      // fall back to ISO date only
    }
  }
  return d.toISOString().slice(0, 10);
}

/**
 * Format date-time with locale defaults.
 * opts: { locale, dateStyle, timeStyle }
 */
export function formatDateTime(input, opts = {}) {
  const d = parseISO(input);
  if (!d) return '—';
  const { locale, dateStyle = 'medium', timeStyle = 'short' } = opts;
  try {
    return new Intl.DateTimeFormat(locale || undefined, { dateStyle, timeStyle }).format(d);
  } catch {
    return d.toISOString();
  }
}

/**
 * Get comparable timestamp number safely (ms since epoch) for sorting.
 */
export function toTimestamp(input) {
  const d = parseISO(input);
  return d ? d.getTime() : 0;
}

export default { parseISO, formatDate, formatDateTime, toTimestamp };
