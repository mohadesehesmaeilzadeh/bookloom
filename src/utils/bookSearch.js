const searchableFields = [
  'title',
  'author',
  'translator',
  'publisher',
  'category',
  'purchaseStore',
  'notes',
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

  return searchableFields.some((field) =>
    normalizeSearchText(book?.[field]).includes(normalizedQuery),
  )
}

export function searchBooks(books, query) {
  if (!query?.trim()) {
    return [...books]
  }

  return books.filter((book) => matchesBookSearch(book, query))
}
