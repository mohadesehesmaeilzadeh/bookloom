import { describe, expect, it, vi } from 'vitest'
import { BOOK_STATUS_ACTION } from '../constants/bookStatusTransitions'
import { createStatusTransitionUpdates } from './applyBookStatusTransition'
import { calculateReadingProgress, isBookProgressComplete, normalizeProgressValues } from './readingProgress'

describe('reading progress and status transitions', () => {
  it('clamps progress and detects completion', () => {
    expect(normalizeProgressValues({ currentPage: 150, totalPages: 100 })).toEqual({ currentPage: 100, totalPages: 100 })
    expect(calculateReadingProgress(25, 100)).toBe(25)
    expect(isBookProgressComplete({ currentPage: 100, totalPages: 100 })).toBe(true)
    expect(isBookProgressComplete({ currentPage: 0, totalPages: 0 })).toBe(false)
  })

  it('sets start and finish dates without losing existing start date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-21T12:00:00.000Z'))

    try {
      const book = { readingStartDate: '2026-09-01', totalPages: 200, currentPage: 50 }
      expect(createStatusTransitionUpdates(book, {
        action: BOOK_STATUS_ACTION.START_READING,
        targetStatus: 'reading',
      })).toMatchObject({ status: 'reading', readingStartDate: '2026-09-01' })
      expect(createStatusTransitionUpdates(book, {
        action: BOOK_STATUS_ACTION.FINISH_READING,
        targetStatus: 'finished',
      })).toMatchObject({ status: 'finished', readingEndDate: '2026-09-21', currentPage: 200 })
    } finally {
      vi.useRealTimers()
    }
  })
})
