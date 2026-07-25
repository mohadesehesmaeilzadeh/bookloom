import { normalizeBook, normalizeBooks } from './bookValidation'
import { normalizePreferencePatch, normalizePreferences } from './preferenceValidation'
import { normalizeReadingGoals } from './readingGoalStorage'

function timestamp(value) {
  const parsed = Date.parse(value)

  return Number.isNaN(parsed) ? 0 : parsed
}

function compareByUpdatedAt(importedBook, localBook) {
  const importedTime = timestamp(importedBook.updatedAt)
  const localTime = timestamp(localBook.updatedAt)

  if (importedTime > 0 && localTime > 0) {
    return importedTime - localTime
  }

  if (importedTime > 0 && localTime === 0) {
    return 1
  }

  if (importedTime === 0 && localTime > 0) {
    return -1
  }

  return 0
}

export function resolveImportedBookDuplicates(importedBooks) {
  const duplicates = new Map()
  const warnings = []

  for (const rawBook of Array.isArray(importedBooks) ? importedBooks : []) {
    const book = normalizeBook(rawBook)
    const existingBook = duplicates.get(book.id)

    if (!existingBook) {
      duplicates.set(book.id, book)
      continue
    }

    warnings.push(`شناسه تکراری «${book.id}» در فایل پشتیبان حل شد.`)

    if (compareByUpdatedAt(book, existingBook) > 0) {
      duplicates.set(book.id, book)
    }
  }

  return {
    books: [...duplicates.values()],
    warnings,
  }
}

export function mergeBooks(currentBooks, importedBooks) {
  const normalizedCurrentBooks = normalizeBooks(currentBooks)
  const importedResolution = resolveImportedBookDuplicates(importedBooks)
  const importedById = new Map(importedResolution.books.map((book) => [book.id, book]))
  const usedIds = new Set()
  const summary = {
    added: 0,
    updated: 0,
    keptLocal: 0,
    duplicatesResolved: importedResolution.warnings.length,
  }
  const mergedBooks = []

  for (const localBook of normalizedCurrentBooks) {
    const importedBook = importedById.get(localBook.id)

    usedIds.add(localBook.id)

    if (!importedBook) {
      summary.keptLocal += 1
      mergedBooks.push(localBook)
      continue
    }

    const shouldUseImported = compareByUpdatedAt(importedBook, localBook) > 0
    mergedBooks.push(shouldUseImported ? importedBook : localBook)
    summary[shouldUseImported ? 'updated' : 'keptLocal'] += 1
    importedById.delete(localBook.id)
  }

  for (const importedBook of importedById.values()) {
    if (usedIds.has(importedBook.id)) {
      continue
    }

    summary.added += 1
    mergedBooks.push(importedBook)
  }

  return {
    books: normalizeBooks(mergedBooks),
    summary,
    warnings: importedResolution.warnings,
  }
}

export function mergeReadingGoals(currentGoals, importedGoals) {
  const current = normalizeReadingGoals(currentGoals)
  const imported = normalizeReadingGoals(importedGoals)
  const mergedGoals = { annualGoals: { ...current.annualGoals } }
  let addedYears = 0

  for (const [year, goal] of Object.entries(imported.annualGoals)) {
    if (!Object.prototype.hasOwnProperty.call(mergedGoals.annualGoals, year)) {
      mergedGoals.annualGoals[year] = goal
      addedYears += 1
    }
  }

  return {
    readingGoals: mergedGoals,
    summary: { addedYears },
  }
}

export function mergeCollectionPreferences(currentPreferences, importedPreferences) {
  const current = normalizePreferences(currentPreferences)
  const imported = normalizePreferencePatch(importedPreferences)
  const mergedPreferences = { ...current }
  let filledPreferences = 0

  for (const [key, value] of Object.entries(imported)) {
    if (!Object.prototype.hasOwnProperty.call(currentPreferences ?? {}, key)) {
      mergedPreferences[key] = value
      filledPreferences += 1
    }
  }

  return {
    preferences: normalizePreferences(mergedPreferences),
    summary: { filledPreferences },
  }
}

export const mergePreferences = mergeCollectionPreferences

export function createMergedBookloomData(currentData, importedData) {
  const bookMerge = mergeBooks(currentData.books, importedData.books)
  const goalMerge = mergeReadingGoals(currentData.readingGoals, importedData.readingGoals)
  const preferenceMerge = mergeCollectionPreferences(
    currentData.preferences ?? currentData.collectionPreferences,
    importedData.preferences ?? importedData.collectionPreferences,
  )

  return {
    data: {
      books: bookMerge.books,
      readingGoals: goalMerge.readingGoals,
      preferences: preferenceMerge.preferences,
    },
    summary: {
      books: bookMerge.summary,
      readingGoals: goalMerge.summary,
      collectionPreferences: preferenceMerge.summary,
    },
    warnings: bookMerge.warnings,
  }
}
