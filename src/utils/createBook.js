import { generateId } from './generateId'
import { normalizeBook } from './bookValidation'

export function createBook(bookData = {}) {
  const now = new Date().toISOString()

  return normalizeBook(
    {
      ...bookData,
      id: bookData.id ?? generateId(),
      createdAt: bookData.createdAt ?? now,
      updatedAt: now,
    },
    {
      now,
      refreshUpdatedAt: true,
    },
  )
}
