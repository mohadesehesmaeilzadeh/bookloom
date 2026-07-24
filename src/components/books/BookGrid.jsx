import BookCard from './BookCard'

function BookGrid({ books, onDelete, onEdit, onView }) {
  if (books.length === 0) {
    return null
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard
          book={book}
          key={book.id}
          onDelete={onDelete}
          onEdit={onEdit}
          onView={onView}
        />
      ))}
    </div>
  )
}

export default BookGrid
