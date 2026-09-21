import { describe, expect, it } from 'vitest'
import { findDuplicateBook } from './findDuplicateBook'

describe('findDuplicateBook', () => {
  const books = [
    { id: 'one', title: 'The Book', author: 'First Author', isbn: '978-1-234' },
    { id: 'two', title: 'Another Book', author: 'Second Author', isbn: '' },
  ]

  it('matches normalized ISBN before title and author', () => {
    expect(findDuplicateBook({ isbn: '9781234', title: 'Different' }, books)?.id).toBe('one')
  })

  it('falls back to normalized title and author when ISBN is missing', () => {
    expect(findDuplicateBook({ title: '  another   BOOK ', author: 'second author' }, books)?.id).toBe('two')
  })

  it('does not block an edit of the same book or a new book', () => {
    expect(findDuplicateBook({ isbn: '9781234' }, books, 'one')).toBeNull()
    expect(findDuplicateBook({ title: 'New', author: 'Writer' }, books)).toBeNull()
  })
})
