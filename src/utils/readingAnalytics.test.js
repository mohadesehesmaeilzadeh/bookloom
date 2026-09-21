import { describe, expect, it } from 'vitest'
import { getReadingAnalytics, getReadingStreak } from './readingAnalytics'

const now = new Date(2026, 8, 21, 12)
const session = (day, durationMs) => ({
  startedAt: new Date(2026, 8, day, 10).toISOString(),
  durationMs,
})

describe('reading analytics', () => {
  it('calculates counts, pages, time, rating, category, and session-date streak', () => {
    const books = [
      {
        status: 'finished', readingEndDate: '2026-09-10', totalPages: 200,
        rating: 4, category: 'Fiction', readingSessions: [session(19, 1_800_000), session(20, 3_600_000)],
      },
      {
        status: 'reading', currentPage: 25, rating: 5, category: 'History',
        readingSessions: [session(21, 1_800_000)],
      },
      {
        status: 'finished', readingEndDate: '2026-01-05', totalPages: 100,
        category: 'Fiction', readingSessions: [],
      },
    ]

    expect(getReadingAnalytics(books, now)).toMatchObject({
      booksThisMonth: 1,
      booksThisYear: 2,
      totalPagesRead: 325,
      totalReadingTimeMs: 7_200_000,
      averageRating: 4.5,
      favoriteCategory: 'Fiction',
      currentStreak: 3,
    })
  })

  it('allows yesterday as the end of a streak and counts an active session today', () => {
    expect(getReadingStreak([{ readingSessions: [session(19, 1000), session(20, 1000)] }], now)).toBe(2)
    expect(getReadingStreak([{
      readingSessions: [session(20, 1000)],
      activeReadingSessionStartedAt: session(21, 1000).startedAt,
    }], now)).toBe(2)
    expect(getReadingStreak([{ readingSessions: [session(19, 1000)] }], now)).toBe(0)
  })

  it('returns useful empty-library values', () => {
    expect(getReadingAnalytics([], now)).toMatchObject({
      booksThisMonth: 0,
      booksThisYear: 0,
      totalPagesRead: 0,
      totalReadingTimeMs: 0,
      averageRating: null,
      favoriteCategory: null,
      currentStreak: 0,
    })
  })
})
