const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parsea un string ISO a Date sin el problema de timezone.
 * Los strings de solo fecha ("YYYY-MM-DD") se tratan como fecha local,
 * no como UTC medianoche, evitando que la fecha cambie en zonas UTC negativas.
 */
export function parseDate(dateStr: string): Date {
  if (DATE_ONLY.test(dateStr)) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(dateStr);
}

export function formatDate(
  dateStr: string,
  options?: Intl.DateTimeFormatOptions,
  locale = "es-AR"
): string {
  return parseDate(dateStr).toLocaleDateString(locale, options);
}
