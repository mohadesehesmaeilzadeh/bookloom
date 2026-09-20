import { DEFAULT_LANGUAGE, LANGUAGE, getDocumentLanguage } from '../i18n/localization'

const numberFormatters = {
  persian: new Intl.NumberFormat('fa-IR'),
  latin: new Intl.NumberFormat('fa-IR-u-nu-latn'),
  english: new Intl.NumberFormat('en-US'),
  persianPlain: new Intl.NumberFormat('fa-IR', {
    useGrouping: false,
  }),
  latinPlain: new Intl.NumberFormat('fa-IR-u-nu-latn', {
    useGrouping: false,
  }),
  englishPlain: new Intl.NumberFormat('en-US', {
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

function getLanguage(options = {}) {
  return options.language ?? getDocumentLanguage()
}

export function formatNumber(value, options = {}) {
  const number = Number(value)
  const language = getLanguage(options)
  const formatter =
    language === LANGUAGE.EN
      ? numberFormatters.english
      : shouldUsePersianDigits(options)
        ? numberFormatters.persian
        : numberFormatters.latin

  if (!Number.isFinite(number)) {
    return formatter.format(0)
  }

  return formatter.format(number)
}

export function formatPlainNumber(value, options = {}) {
  const number = Number(value)
  const language = getLanguage(options)
  const formatter =
    language === LANGUAGE.EN
      ? numberFormatters.englishPlain
      : shouldUsePersianDigits(options)
        ? numberFormatters.persianPlain
        : numberFormatters.latinPlain

  if (!Number.isFinite(number)) {
    return formatter.format(0)
  }

  return formatter.format(number)
}

export function getCurrentNumberLocale() {
  return getDocumentLanguage() === LANGUAGE.EN ? 'en-US' : DEFAULT_LANGUAGE
}
