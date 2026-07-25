import { useContext } from 'react'
import { BooksContext } from './BooksContext'

export function useBooksContext() {
  const context = useContext(BooksContext)

  if (!context) {
    throw new Error('useBooksContext must be used inside a BooksProvider.')
  }

  return context
}
