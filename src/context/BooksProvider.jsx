import { useBooks } from '../hooks/useBooks'
import { BooksContext } from './BooksContext'

export function BooksProvider({ children }) {
  const booksState = useBooks()

  return (
    <BooksContext.Provider value={booksState}>{children}</BooksContext.Provider>
  )
}
