import { BOOK_STATUS } from '../constants/bookStatuses'

const libraryStatuses = new Set([
  BOOK_STATUS.OWNED,
  BOOK_STATUS.READING,
  BOOK_STATUS.PAUSED,
  BOOK_STATUS.FINISHED,
  BOOK_STATUS.ABANDONED,
])

const readingStatuses = new Set([BOOK_STATUS.READING, BOOK_STATUS.PAUSED])

function filterBooksByStatuses(books, statuses) {
  return books.filter((book) => statuses.has(book.status))
}

export function getLibraryBooks(books) {
  return filterBooksByStatuses(books, libraryStatuses)
}

export function getReadingBooks(books) {
  return filterBooksByStatuses(books, readingStatuses)
}

export function getWishlistBooks(books) {
  return books.filter((book) => book.status === BOOK_STATUS.WISHLIST)
}

export function getFinishedBooks(books) {
  return books.filter((book) => book.status === BOOK_STATUS.FINISHED)
}
