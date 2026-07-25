const numberFormatters = {
  persian: new Intl.NumberFormat('fa-IR'),
  latin: new Intl.NumberFormat('fa-IR-u-nu-latn'),
  persianPlain: new Intl.NumberFormat('fa-IR', {
    useGrouping: false,
  }),
  latinPlain: new Intl.NumberFormat('fa-IR-u-nu-latn', {
    useGrouping: false,
  }),
}

function shouldUsePersianDigits(options = {}) {
  if (typeof options.usePersianDigits === 'boolean') {
    return options.usePersianDigits
  }

  if (typeof document === 'undefined') {
    return true
  }

  return document.documentElement.dataset.persianDigits !== 'false'
}

export function formatNumber(value, options = {}) {
  const number = Number(value)
  const formatter = shouldUsePersianDigits(options)
    ? numberFormatters.persian
    : numberFormatters.latin

  if (!Number.isFinite(number)) {
    return formatter.format(0)
  }

  return formatter.format(number)
}

export function formatPlainNumber(value, options = {}) {
  const number = Number(value)
  const formatter = shouldUsePersianDigits(options)
    ? numberFormatters.persianPlain
    : numberFormatters.latinPlain

  if (!Number.isFinite(number)) {
    return formatter.format(0)
  }

  return formatter.format(number)
}
