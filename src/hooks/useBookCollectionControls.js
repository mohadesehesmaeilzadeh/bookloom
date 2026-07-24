import { useEffect, useMemo, useState } from 'react'
import { BOOK_SORT } from '../constants/bookSortOptions'
import { DEFAULT_VIEW_MODE } from '../constants/viewModes'
import { applyBookFilters, ALL_FILTER_VALUE } from '../utils/bookFilters'
import { searchBooks } from '../utils/bookSearch'
import { sortBooks } from '../utils/bookSorting'
import {
  loadCollectionPreferences,
  saveCollectionViewMode,
} from '../utils/collectionPreferences'

function createInitialFilters() {
  return {
    status: ALL_FILTER_VALUE,
    category: ALL_FILTER_VALUE,
    priority: ALL_FILTER_VALUE,
    rating: ALL_FILTER_VALUE,
  }
}

export function useBookCollectionControls({
  books,
  initialSort = BOOK_SORT.NEWEST,
  storageNamespace,
  customSort,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState(createInitialFilters)
  const [sortBy, setSortBy] = useState(initialSort)
  const [viewMode, setViewMode] = useState(() => {
    const preferences = loadCollectionPreferences()
    return preferences[`${storageNamespace}ViewMode`] ?? DEFAULT_VIEW_MODE
  })

  useEffect(() => {
    saveCollectionViewMode(storageNamespace, viewMode)
  }, [storageNamespace, viewMode])

  const visibleBooks = useMemo(() => {
    const searchedBooks = searchBooks(books, searchQuery)
    const filteredBooks = applyBookFilters(searchedBooks, filters)

    return customSort
      ? customSort(filteredBooks, sortBy)
      : sortBooks(filteredBooks, sortBy)
  }, [books, customSort, filters, searchQuery, sortBy])

  function setFilter(name, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }))
  }

  function clearControls() {
    setSearchQuery('')
    setFilters(createInitialFilters())
    setSortBy(initialSort)
  }

  const hasActiveControls =
    searchQuery.trim() !== '' ||
    sortBy !== initialSort ||
    Object.values(filters).some((value) => value !== ALL_FILTER_VALUE)

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    clearControls,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    visibleBooks,
    totalCount: books.length,
    visibleCount: visibleBooks.length,
    hasActiveControls,
  }
}
