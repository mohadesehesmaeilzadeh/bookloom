import { useCallback, useEffect, useRef, useState } from 'react'
import { ENABLE_DEVELOPMENT_SEED, seedBooks } from '../constants/seedBooks'
import { normalizeBooks, normalizeBook } from '../utils/bookValidation'
import { createBook } from '../utils/createBook'
import { BOOK_STATUS } from '../constants/bookStatuses'
import { generateId } from '../utils/generateId'
import { getActiveReadingBook } from '../utils/readingSessions'
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
  const skipNextSaveRef = useRef(false)
  const [books, setBooks] = useState(loadInitialBooks)
  const booksRef = useRef(books)

  useEffect(() => {
    booksRef.current = books

    if (!didInitializeRef.current) {
      didInitializeRef.current = true
      return
    }

    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false
      return
    }

    saveBooks(books)
  }, [books])

  const addBook = useCallback((bookData) => {
    const createdBook = createBook(bookData)

    setBooks((currentBooks) => [...currentBooks, createdBook])

    return createdBook
  }, [])

  const startReadingSession = useCallback((bookId) => {
    const currentBooks = booksRef.current
    const book = currentBooks.find((item) => item.id === bookId)

    if (!book || book.status !== BOOK_STATUS.READING) {
      return { success: false, reason: 'notReading' }
    }

    if (getActiveReadingBook(currentBooks)) {
      return { success: false, reason: 'alreadyActive' }
    }

    const updatedBook = normalizeBook({
      ...book,
      activeReadingSessionStartedAt: new Date().toISOString(),
    }, { refreshUpdatedAt: true })
    const nextBooks = currentBooks.map((item) => item.id === bookId ? updatedBook : item)

    booksRef.current = nextBooks
    setBooks(nextBooks)

    return { success: true, book: updatedBook }
  }, [])

  const stopReadingSession = useCallback((bookId, pagesRead = null) => {
    const currentBooks = booksRef.current
    const book = currentBooks.find((item) => item.id === bookId)

    if (!book?.activeReadingSessionStartedAt) {
      return { success: false, reason: 'notActive' }
    }

    if (pagesRead !== null && (!Number.isInteger(pagesRead) || pagesRead < 0)) {
      return { success: false, reason: 'invalidPages' }
    }

    const nextPage = book.currentPage + (pagesRead ?? 0)

    if (book.totalPages > 0 && nextPage > book.totalPages) {
      return { success: false, reason: 'pagesExceedTotal' }
    }

    const startedAt = book.activeReadingSessionStartedAt
    const endedAt = new Date(Math.max(Date.now(), Date.parse(startedAt))).toISOString()
    const session = {
      id: generateId(),
      startedAt,
      endedAt,
      durationMs: Date.parse(endedAt) - Date.parse(startedAt),
      pagesRead,
    }
    const updatedBook = normalizeBook({
      ...book,
      activeReadingSessionStartedAt: '',
      readingSessions: [...book.readingSessions, session],
      currentPage: nextPage,
      lastProgressUpdate: pagesRead > 0 ? endedAt : book.lastProgressUpdate,
    }, { refreshUpdatedAt: true })
    const nextBooks = currentBooks.map((item) => item.id === bookId ? updatedBook : item)

    booksRef.current = nextBooks
    setBooks(nextBooks)

    return { success: true, book: updatedBook }
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

  const replaceBooks = useCallback((nextBooks, options = {}) => {
    const normalizedBooks = normalizeBooks(nextBooks)
    const persist = options.persist !== false

    if (persist && !saveBooks(normalizedBooks)) {
      return { books: normalizedBooks, success: false }
    }

    if (!persist) {
      skipNextSaveRef.current = true
    }

    setBooks(normalizedBooks)

    return { books: normalizedBooks, success: true }
  }, [])

  return {
    books,
    addBook,
    startReadingSession,
    stopReadingSession,
    updateBook,
    deleteBook,
    getBookById,
    replaceBooks,
  }
}
