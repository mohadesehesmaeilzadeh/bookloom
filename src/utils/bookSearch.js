const searchableFields = [
  'title',
  'author',
  'translator',
  'publisher',
  'category',
  'purchaseStore',
  'notes',
  'personalReview',
]

// Normalize common Arabic variants only for comparison; stored text is untouched.
export function normalizeSearchText(value) {
  if (typeof value !== 'string') {
    return ''
  }

  return value
    .replaceAll('ي', 'ی')
    .replaceAll('ك', 'ک')
    .replaceAll('ۀ', 'ه')
    .replaceAll('ة', 'ه')
    .trim()
    .replaceAll(/\s+/g, ' ')
    .toLocaleLowerCase('fa')
}

export function matchesBookSearch(book, query) {
  const normalizedQuery = normalizeSearchText(query)

  if (!normalizedQuery) {
    return true
  }

  const fieldMatches = searchableFields.some((field) =>
    normalizeSearchText(book?.[field]).includes(normalizedQuery),
  )

  if (fieldMatches) {
    return true
  }

  return Array.isArray(book?.quotes)
    ? book.quotes.some(
        (quote) =>
          normalizeSearchText(quote?.text).includes(normalizedQuery) ||
          normalizeSearchText(quote?.personalNote).includes(normalizedQuery),
      )
    : false
}

export function searchBooks(books, query) {
  if (!query?.trim()) {
    return [...books]
  }

  return books.filter((book) => matchesBookSearch(book, query))
}
