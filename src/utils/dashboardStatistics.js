import { BOOK_STATUS } from '../constants/bookStatuses'
import { calculateReadingProgress, normalizeProgressValues } from './readingProgress'

const libraryStatuses = new Set([
  BOOK_STATUS.OWNED,
  BOOK_STATUS.READING,
  BOOK_STATUS.PAUSED,
  BOOK_STATUS.FINISHED,
  BOOK_STATUS.ABANDONED,
])

const monthLabels = [
  'ژانویه',
  'فوریه',
  'مارس',
  'آوریل',
  'مه',
  'ژوئن',
  'ژوئیه',
  'اوت',
  'سپتامبر',
  'اکتبر',
  'نوامبر',
  'دسامبر',
]

function safeArray(books) {
  return Array.isArray(books) ? books : []
}

function safePageValue(value) {
  const number = Number(value)

  return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : 0
}

function safeTimestamp(value) {
  const parsed = Date.parse(value)

  return Number.isNaN(parsed) ? 0 : parsed
}

function parseLocalDateParts(value) {
  if (typeof value !== 'string') {
    return null
  }

  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!match) {
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return { day, month, year }
}

function dateStringTimestamp(value) {
  const parts = parseLocalDateParts(value)

  if (!parts) {
    return 0
  }

  return new Date(parts.year, parts.month - 1, parts.day).getTime()
}

function normalizeCategoryKey(value) {
  return value
    .trim()
    .replaceAll('ي', 'ی')
    .replaceAll('ك', 'ک')
    .replaceAll('ة', 'ه')
    .replaceAll('ۀ', 'ه')
    .toLocaleLowerCase('fa-IR')
}

function compareByTitle(a, b) {
  return String(a.title ?? '').localeCompare(String(b.title ?? ''), 'fa')
}

function compareActivity(a, b) {
  const updated = safeTimestamp(b.timestamp) - safeTimestamp(a.timestamp)

  if (updated !== 0) {
    return updated
  }

  return compareByTitle(a.book, b.book)
}

function activityTimestamp(book) {
  return Math.max(
    safeTimestamp(book.lastProgressUpdate),
    safeTimestamp(book.updatedAt),
    dateStringTimestamp(book.readingStartDate),
  )
}

export function getTotalReadPages(books) {
  return safeArray(books).reduce((total, book) => {
    if (book.status === BOOK_STATUS.WISHLIST) {
      return total
    }

    // Dashboard pages-read is an estimate from current state:
    // finished books count known total pages; active and abandoned books count current page.
    if (book.status === BOOK_STATUS.FINISHED) {
      return total + safePageValue(book.totalPages)
    }

    if (
      book.status === BOOK_STATUS.READING ||
      book.status === BOOK_STATUS.PAUSED ||
      book.status === BOOK_STATUS.ABANDONED
    ) {
      return total + safePageValue(book.currentPage)
    }

    return total
  }, 0)
}

export function getDashboardSummary(books) {
  const sourceBooks = safeArray(books)
  const libraryBooks = sourceBooks.filter((book) => libraryStatuses.has(book.status))
  const readingCount = sourceBooks.filter((book) => book.status === BOOK_STATUS.READING).length

  return {
    totalBooks: sourceBooks.length,
    libraryBooks: libraryBooks.length,
    readingBooks: readingCount,
    pausedBooks: sourceBooks.filter((book) => book.status === BOOK_STATUS.PAUSED).length,
    finishedBooks: sourceBooks.filter((book) => book.status === BOOK_STATUS.FINISHED).length,
    wishlistBooks: sourceBooks.filter((book) => book.status === BOOK_STATUS.WISHLIST).length,
    totalReadPages: getTotalReadPages(sourceBooks),
  }
}

export function getReadingPagesSummary(books) {
  const sourceBooks = safeArray(books)
  const finishedBooksWithPages = sourceBooks.filter(
    (book) => book.status === BOOK_STATUS.FINISHED && safePageValue(book.totalPages) > 0,
  )
  const pagesInFinishedBooks = finishedBooksWithPages.reduce(
    (total, book) => total + safePageValue(book.totalPages),
    0,
  )
  const activePagesRead = sourceBooks.reduce((total, book) => {
    if (book.status !== BOOK_STATUS.READING && book.status !== BOOK_STATUS.PAUSED) {
      return total
    }

    return total + safePageValue(book.currentPage)
  }, 0)
  const abandonedPagesRead = sourceBooks.reduce((total, book) => {
    if (book.status !== BOOK_STATUS.ABANDONED) {
      return total
    }

    return total + safePageValue(book.currentPage)
  }, 0)

  return {
    abandonedPagesRead,
    activePagesRead,
    averagePagesPerFinishedBook:
      finishedBooksWithPages.length > 0
        ? Math.round(pagesInFinishedBooks / finishedBooksWithPages.length)
        : 0,
    pagesInFinishedBooks,
    totalReadPages: pagesInFinishedBooks + activePagesRead + abandonedPagesRead,
  }
}

export function getContinueReadingBook(books) {
  const sourceBooks = safeArray(books)
  const readingBooks = sourceBooks.filter((book) => book.status === BOOK_STATUS.READING)
  const pausedBooks = sourceBooks.filter((book) => book.status === BOOK_STATUS.PAUSED)
  const candidates = readingBooks.length > 0 ? readingBooks : pausedBooks

  return [...candidates].sort((a, b) => {
    const activityDifference = activityTimestamp(b) - activityTimestamp(a)

    if (activityDifference !== 0) {
      return activityDifference
    }

    return compareByTitle(a, b)
  })[0] ?? null
}

export function getRecentBooks(books, limit = 5) {
  return safeArray(books)
    .filter((book) => safeTimestamp(book.createdAt) > 0)
    .sort((a, b) => {
      const createdDifference = safeTimestamp(b.createdAt) - safeTimestamp(a.createdAt)

      if (createdDifference !== 0) {
        return createdDifference
      }

      return compareByTitle(a, b)
    })
    .slice(0, limit)
}

export function getRecentFinishedBooks(books, limit = 5) {
  return safeArray(books)
    .filter(
      (book) =>
        book.status === BOOK_STATUS.FINISHED && parseLocalDateParts(book.readingEndDate),
    )
    .sort((a, b) => {
      const finishedDifference =
        dateStringTimestamp(b.readingEndDate) - dateStringTimestamp(a.readingEndDate)

      if (finishedDifference !== 0) {
        return finishedDifference
      }

      return compareByTitle(a, b)
    })
    .slice(0, limit)
}

export function getRecentActivity(books, limit = 5) {
  const activities = safeArray(books).flatMap((book) => {
    const items = []

    if (safeTimestamp(book.lastProgressUpdate) > 0) {
      items.push({
        id: `${book.id}-progress`,
        book,
        label: `پیشرفت مطالعه «${book.title}» به‌روزرسانی شده است.`,
        timestamp: book.lastProgressUpdate,
      })
    }

    if (book.status === BOOK_STATUS.FINISHED && parseLocalDateParts(book.readingEndDate)) {
      items.push({
        id: `${book.id}-finished`,
        book,
        label: `کتاب «${book.title}» تمام شده است.`,
        timestamp: new Date(dateStringTimestamp(book.readingEndDate)).toISOString(),
      })
    }

    if (parseLocalDateParts(book.readingStartDate)) {
      items.push({
        id: `${book.id}-started`,
        book,
        label: `مطالعه «${book.title}» شروع شده است.`,
        timestamp: new Date(dateStringTimestamp(book.readingStartDate)).toISOString(),
      })
    }

    if (parseLocalDateParts(book.purchaseDate) && book.status !== BOOK_STATUS.WISHLIST) {
      items.push({
        id: `${book.id}-purchase`,
        book,
        label: `خرید کتاب «${book.title}» ثبت شده است.`,
        timestamp: new Date(dateStringTimestamp(book.purchaseDate)).toISOString(),
      })
    }

    if (safeTimestamp(book.updatedAt) > 0 && book.updatedAt !== book.createdAt) {
      items.push({
        id: `${book.id}-updated`,
        book,
        label: `کتاب «${book.title}» اخیراً به‌روزرسانی شده است.`,
        timestamp: book.updatedAt,
      })
    }

    if (safeTimestamp(book.createdAt) > 0) {
      items.push({
        id: `${book.id}-created`,
        book,
        label: `کتاب «${book.title}» اضافه شده است.`,
        timestamp: book.createdAt,
      })
    }

    return items
  })

  return activities.sort(compareActivity).slice(0, limit)
}

export function getCategoryStatistics(books, limit = 5) {
  const categoryMap = new Map()

  for (const book of safeArray(books)) {
    if (!libraryStatuses.has(book.status) || typeof book.category !== 'string') {
      continue
    }

    const displayName = book.category.trim()

    if (!displayName) {
      continue
    }

    const key = normalizeCategoryKey(displayName)
    const current = categoryMap.get(key) ?? {
      finishedCount: 0,
      name: displayName,
      totalCount: 0,
    }

    current.totalCount += 1

    if (book.status === BOOK_STATUS.FINISHED) {
      current.finishedCount += 1
    }

    categoryMap.set(key, current)
  }

  const categories = [...categoryMap.values()].sort((a, b) => {
    const totalDifference = b.totalCount - a.totalCount

    if (totalDifference !== 0) {
      return totalDifference
    }

    const finishedDifference = b.finishedCount - a.finishedCount

    if (finishedDifference !== 0) {
      return finishedDifference
    }

    return a.name.localeCompare(b.name, 'fa')
  })
  const finishedCategories = [...categories]
    .filter((category) => category.finishedCount > 0)
    .sort((a, b) => {
      const finishedDifference = b.finishedCount - a.finishedCount

      if (finishedDifference !== 0) {
        return finishedDifference
      }

      return a.name.localeCompare(b.name, 'fa')
    })

  return {
    mostCommonCategory: categories[0] ?? null,
    mostCommonFinishedCategory: finishedCategories[0] ?? null,
    topCategories: categories.slice(0, limit),
  }
}

export function getBooksFinishedByMonth(books, year = new Date().getFullYear()) {
  const months = monthLabels.map((label, index) => ({
    count: 0,
    label,
    month: index + 1,
  }))

  for (const book of safeArray(books)) {
    if (book.status !== BOOK_STATUS.FINISHED) {
      continue
    }

    const parts = parseLocalDateParts(book.readingEndDate)

    if (!parts || parts.year !== year) {
      continue
    }

    months[parts.month - 1].count += 1
  }

  return months
}

export function getAnnualGoalProgress(books, goal, year = new Date().getFullYear()) {
  const normalizedGoal = Math.max(0, Math.floor(Number(goal) || 0))
  const finishedThisYear = safeArray(books).filter((book) => {
    if (book.status !== BOOK_STATUS.FINISHED) {
      return false
    }

    const parts = parseLocalDateParts(book.readingEndDate)

    return parts?.year === year
  }).length
  const percentage =
    normalizedGoal > 0 ? Math.round((finishedThisYear / normalizedGoal) * 100) : 0

  return {
    finishedThisYear,
    goal: normalizedGoal,
    percentage,
    progressBarPercentage: Math.min(100, percentage),
    remainingBooks: Math.max(0, normalizedGoal - finishedThisYear),
    year,
  }
}

export function getBookProgressSummary(book) {
  const normalized = normalizeProgressValues({
    currentPage: book?.currentPage,
    totalPages: book?.totalPages,
  })

  return {
    ...normalized,
    percentage: calculateReadingProgress(normalized.currentPage, normalized.totalPages),
    remainingPages:
      normalized.totalPages > 0
        ? Math.max(0, normalized.totalPages - normalized.currentPage)
        : null,
  }
}
