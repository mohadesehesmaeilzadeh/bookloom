function normalizeIsbn(value) {
  return typeof value === 'string' ? value.replace(/[\s-]/g, '').toUpperCase() : ''
}

function normalizeText(value) {
  return typeof value === 'string'
    ? value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase()
    : ''
}

export function findDuplicateBook(candidate, books, excludeId = null) {
  const isbn = normalizeIsbn(candidate.isbn)
  const title = normalizeText(candidate.title)
  const author = normalizeText(candidate.author)

  return books.find((book) => {
    if (book.id === excludeId) {
      return false
    }

    const existingIsbn = normalizeIsbn(book.isbn)

    if (isbn && existingIsbn) {
      return isbn === existingIsbn
    }

    return Boolean(title && author && title === normalizeText(book.title) && author === normalizeText(book.author))
  }) ?? null
}
