import { useMemo, useState } from 'react'
import { BOOK_SORT } from '../constants/bookSortOptions'
import { DEFAULT_VIEW_MODE } from '../constants/viewModes'
import { usePreferences } from '../context/usePreferences'
import { applyBookFilters, ALL_FILTER_VALUE } from '../utils/bookFilters'
import { searchBooks } from '../utils/bookSearch'
import { sortBooks } from '../utils/bookSorting'

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
  const { preferences, updatePreference } = usePreferences()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState(createInitialFilters)
  const [sortBy, setSortBy] = useState(initialSort)
  const viewModePreferenceKey = `${storageNamespace}ViewMode`
  const viewMode = preferences[viewModePreferenceKey] ?? DEFAULT_VIEW_MODE

  function setViewMode(nextViewMode) {
    updatePreference(viewModePreferenceKey, nextViewMode)
  }

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
