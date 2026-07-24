function safeNumber(value) {
  const number = Number(value)

  return Number.isFinite(number) ? number : 0
}

function safePageNumber(value) {
  return Math.floor(Math.max(0, safeNumber(value)))
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function normalizeProgressValues({ currentPage, totalPages }) {
  const normalizedTotalPages = safePageNumber(totalPages)
  let normalizedCurrentPage = safePageNumber(currentPage)

  if (normalizedTotalPages > 0) {
    normalizedCurrentPage = Math.min(normalizedCurrentPage, normalizedTotalPages)
  }

  return {
    currentPage: normalizedCurrentPage,
    totalPages: normalizedTotalPages,
  }
}

export function calculateReadingProgress(currentPage, totalPages) {
  const normalized = normalizeProgressValues({ currentPage, totalPages })

  if (normalized.totalPages <= 0) {
    return 0
  }

  return Math.round(
    clamp((normalized.currentPage / normalized.totalPages) * 100, 0, 100),
  )
}

export function calculateRemainingPages(currentPage, totalPages) {
  const normalized = normalizeProgressValues({ currentPage, totalPages })

  if (normalized.totalPages <= 0) {
    return null
  }

  return Math.max(0, normalized.totalPages - normalized.currentPage)
}

export function isBookProgressComplete(book) {
  const normalized = normalizeProgressValues({
    currentPage: book.currentPage,
    totalPages: book.totalPages,
  })

  return (
    normalized.totalPages > 0 &&
    normalized.currentPage >= normalized.totalPages
  )
}

export function sortReadingBooksByActivity(books) {
  return [...books].sort((a, b) => activityTimestamp(b) - activityTimestamp(a))
}

export function getContinueReadingBook(books) {
  const activeReadingBooks = books.filter((book) => book.status === 'reading')

  if (activeReadingBooks.length > 0) {
    return sortReadingBooksByActivity(activeReadingBooks)[0] ?? null
  }

  const pausedBooks = books.filter((book) => book.status === 'paused')

  return sortReadingBooksByActivity(pausedBooks)[0] ?? null
}

function activityTimestamp(book) {
  return Math.max(
    timestamp(book.lastProgressUpdate),
    timestamp(book.updatedAt),
    timestamp(book.readingStartDate),
  )
}

function timestamp(value) {
  const parsed = Date.parse(value)

  return Number.isNaN(parsed) ? 0 : parsed
}
