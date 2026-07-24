import { useCallback, useEffect, useRef, useState } from 'react'
import { ENABLE_DEVELOPMENT_SEED, seedBooks } from '../constants/seedBooks'
import { normalizeBooks, normalizeBook } from '../utils/bookValidation'
import { createBook } from '../utils/createBook'
import { hasStoredBooks, loadBooks, saveBooks } from '../utils/bookStorage'

function loadInitialBooks() {
  const storedBooks = loadBooks()

  if (
    import.meta.env.DEV &&
    ENABLE_DEVELOPMENT_SEED &&
    storedBooks.length === 0 &&
    !hasStoredBooks()
  ) {
    return normalizeBooks(seedBooks.map((book) => createBook(book)))
  }

  return storedBooks
}

export function useBooks() {
  const didInitializeRef = useRef(false)
  const [books, setBooks] = useState(loadInitialBooks)

  useEffect(() => {
    if (!didInitializeRef.current) {
      didInitializeRef.current = true
      return
    }

    saveBooks(books)
  }, [books])

  const addBook = useCallback((bookData) => {
    const createdBook = createBook(bookData)

    setBooks((currentBooks) => [...currentBooks, createdBook])

    return createdBook
  }, [])

  const updateBook = useCallback(
    (bookId, updates) => {
      const existingBook = books.find((book) => book.id === bookId)

      if (!existingBook) {
        return { book: null, success: false }
      }

      const updatedBook = normalizeBook(
        {
          ...existingBook,
          ...updates,
          id: existingBook.id,
          createdAt: existingBook.createdAt,
        },
        {
          refreshUpdatedAt: true,
        },
      )

      setBooks((currentBooks) =>
        currentBooks.map((book) => (book.id === bookId ? updatedBook : book)),
      )

      return { book: updatedBook, success: true }
    },
    [books],
  )

  const deleteBook = useCallback(
    (bookId) => {
      if (!books.some((book) => book.id === bookId)) {
        return { success: false }
      }

      setBooks((currentBooks) => currentBooks.filter((book) => book.id !== bookId))

      return { success: true }
    },
    [books],
  )

  const getBookById = useCallback(
    (bookId) => books.find((book) => book.id === bookId) ?? null,
    [books],
  )

  return {
    books,
    addBook,
    updateBook,
    deleteBook,
    getBookById,
  }
}
