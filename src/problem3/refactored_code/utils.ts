export function formatCurrency(value: number, fractionDigits = 6) {
  return Math.round(value * (10 ** fractionDigits)) / (10 ** fractionDigits)
}