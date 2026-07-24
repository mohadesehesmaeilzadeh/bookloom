// Bookloom stores book prices in تومان. No currency conversion is applied.
export function formatPrice(value) {
  const number = Number(value)

  if (!Number.isFinite(number) || number <= 0) {
    return ''
  }

  return `${number.toLocaleString('fa-IR')} تومان`
}
