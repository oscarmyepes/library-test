export function toCurrency(value: number, locale = 'es-US', currency = 'USD') {
  if (Number.isNaN(value)) {
    return '';
  }
  return new Intl.NumberFormat(locale, {
    currency,
    style: 'currency',
  }).format(value);
}
