export function toCurrency(value: number, locale = 'en-US', currency = 'USD') {
  if (Number.isNaN(value)) {
    return '';
  }
  return new Intl.NumberFormat(locale, {
    currency,
    style: 'currency',
  }).format(value);
}

export function toLocaleNumber(value: number, locale = 'en-US') {
  return new Intl.NumberFormat(locale).format(Number(value));
}
