import { BOOK_STATUS } from '../constants/bookStatuses'
import { normalizeBooks } from './bookValidation'
import { normalizePreferences } from './preferenceValidation'
import { normalizeReadingGoals } from './readingGoalStorage'

export function getBackupSummary(data) {
  const books = normalizeBooks(data?.books)
  const readingGoals = normalizeReadingGoals(data?.readingGoals)
  const preferences = normalizePreferences(data?.preferences ?? data?.collectionPreferences)

  return {
    bookCount: books.length,
    wishlistCount: books.filter((book) => book.status === BOOK_STATUS.WISHLIST).length,
    finishedCount: books.filter((book) => book.status === BOOK_STATUS.FINISHED).length,
    quoteCount: books.reduce((total, book) => total + book.quotes.length, 0),
    readingGoalYearCount: Object.keys(readingGoals.annualGoals).length,
    hasCollectionPreferences: Object.keys(preferences).length > 0,
  }
}
