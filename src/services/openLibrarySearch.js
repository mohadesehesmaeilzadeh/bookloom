const OPEN_LIBRARY_SEARCH_URL = 'https://openlibrary.org/search.json'
const OPEN_LIBRARY_COVER_URL = 'https://covers.openlibrary.org/b/id'
const SEARCH_LIMIT = 10

export const OPEN_LIBRARY_SEARCH_TYPES = {
  TITLE: 'title',
  AUTHOR: 'author',
  ISBN: 'isbn',
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function firstString(value) {
  if (Array.isArray(value)) {
    return normalizeString(value[0])
  }

  return normalizeString(value)
}

function pickIsbn(value, searchedIsbn) {
  const isbns = Array.isArray(value) ? value : [value]
  const normalizedQuery = searchedIsbn.replace(/[\s-]/g, '').toUpperCase()

  return isbns.find((isbn) =>
    typeof isbn === 'string' && isbn.replace(/[\s-]/g, '').toUpperCase() === normalizedQuery
  ) ?? firstString(value)
}

function normalizePositiveInteger(value) {
  const number = Number(value)

  return Number.isInteger(number) && number > 0 ? number : 0
}

function normalizePublishYear(value) {
  const year = Number(value)

  return Number.isInteger(year) && year > 0 ? year : null
}

function getCoverUrl(coverId) {
  const normalizedCoverId = normalizePositiveInteger(coverId)

  return normalizedCoverId
    ? `${OPEN_LIBRARY_COVER_URL}/${normalizedCoverId}-M.jpg`
    : null
}

function buildSearchUrl(query, searchType) {
  const trimmedQuery = query.trim()
  const params = new URLSearchParams({
    fields: [
      'key',
      'title',
      'author_name',
      'isbn',
      'first_publish_year',
      'cover_i',
      'publisher',
      'number_of_pages_median',
    ].join(','),
    limit: String(SEARCH_LIMIT),
  })

  if (searchType === OPEN_LIBRARY_SEARCH_TYPES.TITLE) {
    params.set('title', trimmedQuery)
  } else if (searchType === OPEN_LIBRARY_SEARCH_TYPES.AUTHOR) {
    params.set('author', trimmedQuery)
  } else {
    params.set('q', `isbn:${trimmedQuery.replace(/[-\s]/g, '')}`)
  }

  return `${OPEN_LIBRARY_SEARCH_URL}?${params.toString()}`
}

export function normalizeOpenLibraryBook(doc, searchedIsbn = '') {
  if (!isRecord(doc)) {
    return null
  }

  const title = normalizeString(doc.title)

  if (!title) {
    return null
  }

  const author = firstString(doc.author_name)
  const isbn = pickIsbn(doc.isbn, searchedIsbn)
  const publisher = firstString(doc.publisher)
  const totalPages = normalizePositiveInteger(doc.number_of_pages_median)

  return {
    id: normalizeString(doc.key) || title,
    title,
    author,
    publisher,
    publishYear: normalizePublishYear(doc.first_publish_year),
    coverUrl: getCoverUrl(doc.cover_i),
    book: {
      title,
      author,
      isbn,
      coverUrl: getCoverUrl(doc.cover_i) ?? '',
      publishYear: normalizePublishYear(doc.first_publish_year) ?? 0,
      publisher,
      totalPages,
    },
  }
}

export async function searchOpenLibraryBooks(query, searchType, options = {}) {
  const trimmedQuery = query.trim()

  if (!trimmedQuery) {
    return []
  }

  const response = await fetch(buildSearchUrl(trimmedQuery, searchType), {
    signal: options.signal,
  })

  if (!response.ok) {
    throw new Error('Open Library search failed.')
  }

  const data = await response.json()
  const docs = Array.isArray(data.docs) ? data.docs : []

  const searchedIsbn = searchType === OPEN_LIBRARY_SEARCH_TYPES.ISBN ? trimmedQuery : ''

  return docs.map((doc) => normalizeOpenLibraryBook(doc, searchedIsbn)).filter(Boolean)
}
