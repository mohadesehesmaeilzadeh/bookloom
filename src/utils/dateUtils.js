import { LANGUAGE, getDocumentLanguage } from '../i18n/localization'

function getDateLocale(options = {}) {
  return (options.language ?? getDocumentLanguage()) === LANGUAGE.EN ? 'en-US' : 'fa-IR'
}

export function getTodayDateString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function formatDateTime(value, options = {}) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(getDateLocale(options), {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function formatDate(value, options = {}) {
  if (!value) {
    return ''
  }

  const dateOnlyMatch =
    typeof value === 'string' ? value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/) : null
  const date = dateOnlyMatch
    ? new Date(
        Number(dateOnlyMatch[1]),
        Number(dateOnlyMatch[2]) - 1,
        Number(dateOnlyMatch[3]),
      )
    : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(getDateLocale(options), {
    dateStyle: 'medium',
  }).format(date)
}
