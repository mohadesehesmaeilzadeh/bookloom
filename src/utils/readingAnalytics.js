import { BOOK_STATUS } from '../constants/bookStatuses'
import {
  getBooksFinishedByMonth,
  getCategoryStatistics,
  getTotalReadPages,
} from './dashboardStatistics'

function localDayKey(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function dayKeyFromDate(date) {
  return localDayKey(date)
}

export function getReadingStreak(books, now = new Date()) {
  const readingDays = new Set()

  for (const book of books) {
    const activeDay = localDayKey(book.activeReadingSessionStartedAt)

    if (activeDay) {
      readingDays.add(activeDay)
    }

    for (const session of book.readingSessions ?? []) {
      const day = localDayKey(session.startedAt)

      if (day) {
        readingDays.add(day)
      }
    }
  }

  const cursor = new Date(now)
  cursor.setHours(0, 0, 0, 0)

  if (!readingDays.has(dayKeyFromDate(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0

  while (readingDays.has(dayKeyFromDate(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export function getReadingAnalytics(books, now = new Date()) {
  const finishedByMonth = getBooksFinishedByMonth(books, now.getFullYear())
  let totalReadingTimeMs = 0
  let ratingTotal = 0
  let ratedBooks = 0

  for (const book of books) {
    if (book.status !== BOOK_STATUS.WISHLIST && Number(book.rating) > 0) {
      ratingTotal += Number(book.rating)
      ratedBooks += 1
    }

    for (const session of book.readingSessions ?? []) {
      const duration = Number(session.durationMs)

      if (Number.isFinite(duration) && duration > 0) {
        totalReadingTimeMs += duration
      }
    }
  }

  const categories = getCategoryStatistics(books)

  return {
    booksThisMonth: finishedByMonth[now.getMonth()].count,
    booksThisYear: finishedByMonth.reduce((total, month) => total + month.count, 0),
    totalPagesRead: getTotalReadPages(books),
    totalReadingTimeMs,
    averageRating: ratedBooks > 0 ? ratingTotal / ratedBooks : null,
    favoriteCategory: categories.mostCommonFinishedCategory?.name ??
      categories.mostCommonCategory?.name ?? null,
    currentStreak: getReadingStreak(books, now),
  }
}
