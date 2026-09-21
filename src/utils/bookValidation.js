import {
  DEFAULT_BOOK_PRIORITY,
  bookPriorityValues,
} from '../constants/bookPriorities'
import { DEFAULT_BOOK_STATUS, bookStatusValues } from '../constants/bookStatuses'
import { generateId } from './generateId'
import { normalizeQuotes } from './quoteValidation'
import { normalizeReadingSessions } from './readingSessions'

const stringFields = [
  'title',
  'author',
  'isbn',
  'coverUrl',
  'translator',
  'publisher',
  'category',
  'purchaseDate',
  'readingStartDate',
  'readingEndDate',
  'purchaseStore',
  'notes',
  'personalReview',
]

const defaultBookValues = {
  title: '',
  author: '',
  isbn: '',
  coverUrl: '',
  publishYear: 0,
  translator: '',
  publisher: '',
  category: '',
  status: DEFAULT_BOOK_STATUS,
  purchaseDate: '',
  readingStartDate: '',
  readingEndDate: '',
  totalPages: 0,
  currentPage: 0,
  priority: DEFAULT_BOOK_PRIORITY,
  rating: 0,
  price: 0,
  expectedPrice: 0,
  purchaseStore: '',
  notes: '',
  personalReview: '',
  quotes: [],
  readingSessions: [],
  activeReadingSessionStartedAt: '',
  lastProgressUpdate: '',
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeId(value) {
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  return generateId()
}

function normalizeNonNegativeNumber(value) {
  const number = Number(value)

  return Number.isFinite(number) ? Math.max(0, number) : 0
}

function normalizePageNumber(value) {
  return Math.floor(normalizeNonNegativeNumber(value))
}

function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function isValidTimestamp(value) {
  return typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Date.parse(value))
}

export function isValidBookStatus(status) {
  return bookStatusValues.includes(status)
}

export function isValidBookPriority(priority) {
  return bookPriorityValues.includes(priority)
}

export function normalizeBook(book, options = {}) {
  const source = isRecord(book) ? book : {}
  const now = options.now ?? new Date().toISOString()
  const normalized = {
    ...source,
    id: normalizeId(source.id),
    ...defaultBookValues,
  }

  for (const field of stringFields) {
    normalized[field] = normalizeString(source[field])
  }

  normalized.status = isValidBookStatus(source.status)
    ? source.status
    : DEFAULT_BOOK_STATUS
  normalized.priority = isValidBookPriority(source.priority)
    ? source.priority
    : DEFAULT_BOOK_PRIORITY
  normalized.totalPages = normalizePageNumber(source.totalPages)
  normalized.publishYear = normalizePageNumber(source.publishYear)
  normalized.currentPage = normalizePageNumber(source.currentPage)

  if (normalized.totalPages > 0 && normalized.currentPage > normalized.totalPages) {
    normalized.currentPage = normalized.totalPages
  }

  normalized.rating = clampNumber(normalizeNonNegativeNumber(source.rating), 0, 5)
  normalized.price = normalizeNonNegativeNumber(source.price)
  normalized.expectedPrice = normalizeNonNegativeNumber(source.expectedPrice)
  normalized.quotes = normalizeQuotes(source.quotes, { now })
  normalized.readingSessions = normalizeReadingSessions(source.readingSessions)
  normalized.activeReadingSessionStartedAt =
    typeof source.activeReadingSessionStartedAt === 'string' &&
    Number.isFinite(Date.parse(source.activeReadingSessionStartedAt))
      ? source.activeReadingSessionStartedAt
      : ''
  normalized.lastProgressUpdate = isValidTimestamp(source.lastProgressUpdate)
    ? source.lastProgressUpdate
    : ''
  normalized.createdAt = isValidTimestamp(source.createdAt) ? source.createdAt : now
  normalized.updatedAt =
    options.refreshUpdatedAt || !isValidTimestamp(source.updatedAt)
      ? now
      : source.updatedAt

  return normalized
}

export function normalizeBooks(books) {
  if (!Array.isArray(books)) {
    return []
  }

  const usedIds = new Set()

  return books.reduce((normalizedBooks, book) => {
    if (!isRecord(book)) {
      return normalizedBooks
    }

    const normalizedBook = normalizeBook(book)

    // Stored data can be edited outside the app; duplicate IDs get reassigned
    // so hook operations keep addressing one book at a time.
    while (usedIds.has(normalizedBook.id)) {
      normalizedBook.id = generateId()
    }

    usedIds.add(normalizedBook.id)
    normalizedBooks.push(normalizedBook)

    return normalizedBooks
  }, [])
}
