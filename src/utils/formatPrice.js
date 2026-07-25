import { formatNumber } from './formatNumber'

// Bookloom stores book prices in تومان. No currency conversion is applied.
export function formatPrice(value, options = {}) {
  const number = Number(value)

  if (!Number.isFinite(number) || number <= 0) {
    return ''
  }

  return `${formatNumber(number, options)} تومان`
}
