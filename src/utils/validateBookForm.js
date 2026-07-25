import {
  DEFAULT_BOOK_PRIORITY,
  bookPriorityValues,
} from '../constants/bookPriorities'
import { DEFAULT_BOOK_STATUS, bookStatusValues } from '../constants/bookStatuses'

export const emptyBookFormValues = {
  title: '',
  author: '',
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
  totalPages: 'تعداد صفحات نمی‌تواند منفی باشد.',
  price: 'قیمت نمی‌تواند منفی باشد.',
  expectedPrice: 'قیمت نمی‌تواند منفی باشد.',
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

export function validateBookForm(values) {
  const errors = {}

  if (!values.title.trim()) {
    errors.title = 'نام کتاب الزامی است.'
  }

  for (const field of ['totalPages', 'price', 'expectedPrice']) {
    if (validateNonNegativeNumber(values[field]) === 'invalid') {
      errors[field] = numericFieldMessages[field]
    }
  }

  if (!bookStatusValues.includes(values.status)) {
    errors.status = 'وضعیت انتخاب‌شده معتبر نیست.'
  }

  if (!bookPriorityValues.includes(values.priority)) {
    errors.priority = 'اولویت انتخاب‌شده معتبر نیست.'
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
