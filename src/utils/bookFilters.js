import { bookPriorityValues } from '../constants/bookPriorities'
import { bookStatusValues } from '../constants/bookStatuses'

export const ALL_FILTER_VALUE = 'all'

function hasFilter(value) {
  return value && value !== ALL_FILTER_VALUE
}

export function filterBooksByStatus(books, status) {
  if (!hasFilter(status) || !bookStatusValues.includes(status)) {
    return [...books]
  }

  return books.filter((book) => book.status === status)
}

export function filterBooksByCategory(books, category) {
  if (!hasFilter(category)) {
    return [...books]
  }

  const normalizedCategory = category.trim()

  return books.filter((book) => book.category?.trim() === normalizedCategory)
}

export function filterBooksByPriority(books, priority) {
  if (!hasFilter(priority) || !bookPriorityValues.includes(priority)) {
    return [...books]
  }

  return books.filter((book) => book.priority === priority)
}

export function filterBooksByRating(books, ratingMinimum) {
  if (!hasFilter(ratingMinimum)) {
    return [...books]
  }

  const minimum = Number(ratingMinimum)

  if (!Number.isFinite(minimum) || minimum <= 0) {
    return [...books]
  }

  return books.filter((book) => Number(book.rating) >= minimum)
}

export function applyBookFilters(books, filters = {}) {
  return filterBooksByRating(
    filterBooksByPriority(
      filterBooksByCategory(filterBooksByStatus(books, filters.status), filters.category),
      filters.priority,
    ),
    filters.rating,
  )
}

export function getCategoryOptions(books) {
  return [
    ...new Set(
      books
        .map((book) => (typeof book.category === 'string' ? book.category.trim() : ''))
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b, 'fa'))
}
