const persianNumberFormatter = new Intl.NumberFormat('fa-IR')

export function formatNumber(value) {
  const number = Number(value)

  if (!Number.isFinite(number)) {
    return persianNumberFormatter.format(0)
  }

  return persianNumberFormatter.format(number)
}
