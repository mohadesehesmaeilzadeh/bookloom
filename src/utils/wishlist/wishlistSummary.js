import { BOOK_PRIORITY } from '../../constants/bookPriorities'

function safePrice(value) {
  const price = Number(value)

  return Number.isFinite(price) && price > 0 ? price : 0
}

export function getWishlistSummary(books) {
  return {
    totalCount: books.length,
    estimatedTotalPrice: books.reduce(
      (sum, book) => sum + safePrice(book.expectedPrice),
      0,
    ),
    highPriorityCount: books.filter((book) => book.priority === BOOK_PRIORITY.HIGH)
      .length,
    urgentPriorityCount: books.filter(
      (book) => book.priority === BOOK_PRIORITY.URGENT,
    ).length,
  }
}
