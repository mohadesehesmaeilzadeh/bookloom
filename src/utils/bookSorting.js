import { BOOK_STATUS } from '../constants/bookStatuses'
import { BOOK_SORT } from '../constants/bookSortOptions'
import { calculateReadingProgress } from './readingProgress'

function timestamp(value) {
  const parsed = Date.parse(value)

  return Number.isNaN(parsed) ? 0 : parsed
}

function number(value) {
  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : 0
}

function priceForBook(book) {
  return book.status === BOOK_STATUS.WISHLIST
    ? number(book.expectedPrice)
    : number(book.price)
}

function recentTimestamp(book) {
  return Math.max(
    timestamp(book.lastProgressUpdate),
    timestamp(book.updatedAt),
    timestamp(book.createdAt),
  )
}

export function sortBooks(books, sortBy = BOOK_SORT.NEWEST) {
  const sortedBooks = [...books]

  return sortedBooks.sort((a, b) => {
    if (sortBy === BOOK_SORT.OLDEST) {
      return timestamp(a.createdAt) - timestamp(b.createdAt)
    }

    if (sortBy === BOOK_SORT.TITLE) {
      return (a.title || '').localeCompare(b.title || '', 'fa')
    }

    if (sortBy === BOOK_SORT.AUTHOR) {
      return (a.author || '').localeCompare(b.author || '', 'fa')
    }

    if (sortBy === BOOK_SORT.HIGHEST_RATING) {
      return number(b.rating) - number(a.rating)
    }

    if (sortBy === BOOK_SORT.HIGHEST_PROGRESS) {
      return (
        calculateReadingProgress(b.currentPage, b.totalPages) -
        calculateReadingProgress(a.currentPage, a.totalPages)
      )
    }

    if (sortBy === BOOK_SORT.LOWEST_PRICE) {
      return priceForBook(a) - priceForBook(b)
    }

    if (sortBy === BOOK_SORT.HIGHEST_PRICE) {
      return priceForBook(b) - priceForBook(a)
    }

    if (sortBy === BOOK_SORT.RECENTLY_UPDATED) {
      return recentTimestamp(b) - recentTimestamp(a)
    }

    if (sortBy === BOOK_SORT.READING_STARTED_NEWEST) {
      return timestamp(b.readingStartDate) - timestamp(a.readingStartDate)
    }

    if (sortBy === BOOK_SORT.FINISHED_NEWEST) {
      return timestamp(b.readingEndDate) - timestamp(a.readingEndDate)
    }

    if (sortBy === BOOK_SORT.FINISHED_OLDEST) {
      return timestamp(a.readingEndDate) - timestamp(b.readingEndDate)
    }

    if (sortBy === BOOK_SORT.MOST_PAGES) {
      return number(b.totalPages) - number(a.totalPages)
    }

    return timestamp(b.createdAt) - timestamp(a.createdAt)
  })
}
