import {
  DEFAULT_BOOK_PRIORITY,
  bookPriorityValues,
} from '../constants/bookPriorities'
import { DEFAULT_BOOK_STATUS, bookStatusValues } from '../constants/bookStatuses'
import { t } from '../i18n/localization'

export const emptyBookFormValues = {
  title: '',
  author: '',
  isbn: '',
  coverUrl: '',
  publishYear: '',
  translator: '',
  publisher: '',
  category: '',
  status: DEFAULT_BOOK_STATUS,
  purchaseDate: '',
  totalPages: '',
  price: '',
  expectedPrice: '',
  purchaseStore: '',
  priority: DEFAULT_BOOK_PRIORITY,
  notes: '',
}

const numericFieldMessages = {
  publishYear: 'validation.book.publishYearInvalid',
  totalPages: 'validation.book.totalPagesNonNegative',
  price: 'validation.book.priceNonNegative',
  expectedPrice: 'validation.book.priceNonNegative',
}

function toInputNumber(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0 ? String(value) : ''
}

function validateNonNegativeNumber(value) {
  if (value === '') {
    return ''
  }

  const numberValue = Number(value)

  if (!Number.isFinite(numberValue) || numberValue < 0) {
    return 'invalid'
  }

  return ''
}

export function getInitialBookFormValues(book) {
  if (!book) {
    return emptyBookFormValues
  }

  return {
    title: book.title ?? '',
    author: book.author ?? '',
    isbn: book.isbn ?? '',
    coverUrl: book.coverUrl ?? '',
    publishYear: toInputNumber(book.publishYear),
    translator: book.translator ?? '',
    publisher: book.publisher ?? '',
    category: book.category ?? '',
    status: bookStatusValues.includes(book.status) ? book.status : DEFAULT_BOOK_STATUS,
    purchaseDate: book.purchaseDate ?? '',
    totalPages: toInputNumber(book.totalPages),
    price: toInputNumber(book.price),
    expectedPrice: toInputNumber(book.expectedPrice),
    purchaseStore: book.purchaseStore ?? '',
    priority: bookPriorityValues.includes(book.priority)
      ? book.priority
      : DEFAULT_BOOK_PRIORITY,
    notes: book.notes ?? '',
  }
}

export function validateBookForm(values, language) {
  const errors = {}

  if (!values.title.trim()) {
    errors.title = t('validation.book.titleRequired', undefined, language)
  }

  for (const field of ['totalPages', 'price', 'expectedPrice']) {
    if (validateNonNegativeNumber(values[field]) === 'invalid') {
      errors[field] = t(numericFieldMessages[field], undefined, language)
    }
  }

  if (values.publishYear !== '' &&
    (!Number.isInteger(Number(values.publishYear)) || Number(values.publishYear) < 1 || Number(values.publishYear) > 9999)) {
    errors.publishYear = t(numericFieldMessages.publishYear, undefined, language)
  }

  if (!bookStatusValues.includes(values.status)) {
    errors.status = t('validation.book.statusInvalid', undefined, language)
  }

  if (!bookPriorityValues.includes(values.priority)) {
    errors.priority = t('validation.book.priorityInvalid', undefined, language)
  }

  return errors
}

export function hasBookFormErrors(errors) {
  return Object.keys(errors).length > 0
}

export function createBookFormPayload(values) {
  return {
    title: values.title.trim(),
    author: values.author.trim(),
    isbn: values.isbn.trim(),
    coverUrl: values.coverUrl,
    publishYear: values.publishYear === '' ? 0 : Number(values.publishYear),
    translator: values.translator.trim(),
    publisher: values.publisher.trim(),
    category: values.category.trim(),
    status: values.status,
    purchaseDate: values.purchaseDate,
    totalPages: values.totalPages === '' ? 0 : Number(values.totalPages),
    price: values.price === '' ? 0 : Number(values.price),
    expectedPrice: values.expectedPrice === '' ? 0 : Number(values.expectedPrice),
    purchaseStore: values.purchaseStore.trim(),
    priority: values.priority,
    notes: values.notes.trim(),
  }
}
