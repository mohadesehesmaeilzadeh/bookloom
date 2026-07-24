import { normalizeBooks } from './bookValidation'

export const BOOKS_STORAGE_KEY = 'bookloom_books'

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function reportStorageError(message, error) {
  if (import.meta.env.DEV) {
    console.warn(`[Bookloom] ${message}`, error)
  }
}

export function hasStoredBooks() {
  if (!canUseLocalStorage()) {
    return false
  }

  try {
    return window.localStorage.getItem(BOOKS_STORAGE_KEY) !== null
  } catch (error) {
    reportStorageError('Unable to check stored books.', error)
    return false
  }
}

export function loadBooks() {
  if (!canUseLocalStorage()) {
    return []
  }

  let rawBooks

  try {
    rawBooks = window.localStorage.getItem(BOOKS_STORAGE_KEY)
  } catch (error) {
    reportStorageError('Unable to read books from localStorage.', error)
    return []
  }

  if (rawBooks === null) {
    return []
  }

  try {
    const parsedBooks = JSON.parse(rawBooks)

    if (!Array.isArray(parsedBooks)) {
      reportStorageError('Stored books data is not an array.', parsedBooks)
      return []
    }

    return normalizeBooks(parsedBooks)
  } catch (error) {
    reportStorageError('Stored books JSON could not be parsed.', error)
    return []
  }
}

export function saveBooks(books) {
  if (!Array.isArray(books)) {
    reportStorageError('saveBooks expected an array.', books)
    return false
  }

  if (!canUseLocalStorage()) {
    return false
  }

  try {
    window.localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(normalizeBooks(books)))
    return true
  } catch (error) {
    reportStorageError('Unable to save books to localStorage.', error)
    return false
  }
}

export function clearBooks() {
  if (!canUseLocalStorage()) {
    return false
  }

  try {
    window.localStorage.removeItem(BOOKS_STORAGE_KEY)
    return true
  } catch (error) {
    reportStorageError('Unable to clear Bookloom books from localStorage.', error)
    return false
  }
}
