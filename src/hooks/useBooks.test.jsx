// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useBooks } from './useBooks'
import { BOOKS_STORAGE_KEY } from '../utils/bookStorage'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  localStorage.clear()
})

describe('useBooks', () => {
  it('adds, edits, and deletes a book while preserving its ID', () => {
    const { result } = renderHook(() => useBooks())
    let added

    act(() => {
      added = result.current.addBook({ title: 'Book A', author: 'Author A' })
    })

    expect(result.current.books).toHaveLength(1)
    expect(JSON.parse(localStorage.getItem(BOOKS_STORAGE_KEY))[0].id).toBe(added.id)

    act(() => {
      expect(result.current.updateBook(added.id, { title: 'Edited Book' }).success).toBe(true)
    })

    expect(result.current.books[0]).toMatchObject({ id: added.id, title: 'Edited Book' })

    act(() => {
      expect(result.current.deleteBook(added.id).success).toBe(true)
    })

    expect(result.current.books).toEqual([])
    expect(JSON.parse(localStorage.getItem(BOOKS_STORAGE_KEY))).toEqual([])
  })

  it('restores an active session after remount and records elapsed time and pages', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-21T10:00:00.000Z'))
    localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify([
      { id: 'one', title: 'One', status: 'reading', totalPages: 100, currentPage: 10 },
      { id: 'two', title: 'Two', status: 'reading', totalPages: 80 },
    ]))
    const first = renderHook(() => useBooks())

    act(() => {
      expect(first.result.current.startReadingSession('one').success).toBe(true)
    })

    expect(first.result.current.books[0].activeReadingSessionStartedAt).toBe('2026-09-21T10:00:00.000Z')
    expect(first.result.current.startReadingSession('two')).toMatchObject({ success: false, reason: 'alreadyActive' })
    first.unmount()

    vi.advanceTimersByTime(90_000)
    const restored = renderHook(() => useBooks())

    expect(restored.result.current.books[0].activeReadingSessionStartedAt).toBe('2026-09-21T10:00:00.000Z')

    act(() => {
      expect(restored.result.current.stopReadingSession('one', 12).success).toBe(true)
    })

    const book = restored.result.current.books[0]
    expect(book.currentPage).toBe(22)
    expect(book.activeReadingSessionStartedAt).toBe('')
    expect(book.readingSessions[0]).toMatchObject({ durationMs: 90_000, pagesRead: 12 })
    expect(JSON.parse(localStorage.getItem(BOOKS_STORAGE_KEY))[0].readingSessions).toHaveLength(1)
  })

  it('rejects excess pages and allows stopping without changing progress', () => {
    localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify([
      { id: 'one', title: 'One', status: 'reading', totalPages: 20, currentPage: 18 },
    ]))
    const { result } = renderHook(() => useBooks())

    act(() => {
      result.current.startReadingSession('one')
    })

    expect(result.current.stopReadingSession('one', 3)).toMatchObject({ success: false, reason: 'pagesExceedTotal' })

    act(() => {
      expect(result.current.stopReadingSession('one').success).toBe(true)
    })

    expect(result.current.books[0].currentPage).toBe(18)
    expect(result.current.books[0].readingSessions[0].pagesRead).toBeNull()
  })

  it('replaces stored books for a confirmed restore', () => {
    localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify([{ id: 'old', title: 'Old' }]))
    const { result } = renderHook(() => useBooks())

    act(() => {
      expect(result.current.replaceBooks([{ id: 'restored', title: 'Restored' }]).success).toBe(true)
    })

    expect(result.current.books.map((book) => book.id)).toEqual(['restored'])
    expect(JSON.parse(localStorage.getItem(BOOKS_STORAGE_KEY)).map((book) => book.id)).toEqual(['restored'])
  })
})
