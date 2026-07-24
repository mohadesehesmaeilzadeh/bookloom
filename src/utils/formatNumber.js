const persianNumberFormatter = new Intl.NumberFormat('fa-IR')
const persianPlainNumberFormatter = new Intl.NumberFormat('fa-IR', {
  useGrouping: false,
})

export function formatNumber(value) {
  const number = Number(value)

  if (!Number.isFinite(number)) {
    return persianNumberFormatter.format(0)
  }

  return persianNumberFormatter.format(number)
}

export function formatPlainNumber(value) {
  const number = Number(value)

  if (!Number.isFinite(number)) {
    return persianPlainNumberFormatter.format(0)
  }

  return persianPlainNumberFormatter.format(number)
}
