import { generateId } from './generateId'
import { t } from '../i18n/localization'

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeQuoteId(value) {
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  return generateId()
}

function normalizePageNumber(value) {
  if (value === '' || value === null || value === undefined) {
    return ''
  }

  const number = Number(value)

  if (!Number.isFinite(number)) {
    return ''
  }

  return Math.floor(Math.max(0, number))
}

function isValidTimestamp(value) {
  return typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Date.parse(value))
}

export function normalizeQuote(quote, options = {}) {
  const source = isRecord(quote) ? quote : {}
  const now = options.now ?? new Date().toISOString()

  return {
    id: normalizeQuoteId(source.id),
    text: normalizeString(source.text),
    pageNumber: normalizePageNumber(source.pageNumber),
    personalNote: normalizeString(source.personalNote),
    createdAt: isValidTimestamp(source.createdAt) ? source.createdAt : now,
    updatedAt:
      options.refreshUpdatedAt || !isValidTimestamp(source.updatedAt)
        ? now
        : source.updatedAt,
  }
}

export function normalizeQuotes(quotes, options = {}) {
  if (!Array.isArray(quotes)) {
    return []
  }

  const usedIds = new Set()

  return quotes.reduce((normalizedQuotes, quote) => {
    if (!isRecord(quote)) {
      return normalizedQuotes
    }

    const normalizedQuote = normalizeQuote(quote, options)

    while (usedIds.has(normalizedQuote.id)) {
      normalizedQuote.id = generateId()
    }

    usedIds.add(normalizedQuote.id)
    normalizedQuotes.push(normalizedQuote)

    return normalizedQuotes
  }, [])
}

export function validateQuoteInput(values, language) {
  const errors = {}
  const text = normalizeString(values.text)
  const pageNumber = values.pageNumber === '' ? '' : Number(values.pageNumber)

  if (!text) {
    errors.text = t('quotes.validation.textRequired', undefined, language)
  }

  if (values.pageNumber !== '') {
    if (!Number.isFinite(pageNumber)) {
      errors.pageNumber = t('quotes.validation.pageInvalid', undefined, language)
    } else if (pageNumber < 0) {
      errors.pageNumber = t('quotes.validation.pageNegative', undefined, language)
    }
  }

  return errors
}

export function createQuotePayload(values) {
  const now = new Date().toISOString()

  return normalizeQuote(
    {
      ...values,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    },
    { now },
  )
}

export function updateQuotePayload(existingQuote, values) {
  return normalizeQuote(
    {
      ...existingQuote,
      ...values,
      id: existingQuote.id,
      createdAt: existingQuote.createdAt,
      updatedAt: new Date().toISOString(),
    },
    { refreshUpdatedAt: false },
  )
}
