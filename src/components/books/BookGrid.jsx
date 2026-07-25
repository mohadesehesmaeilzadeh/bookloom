import BookCard from './BookCard'

function BookGrid({
  books,
  onDelete,
  onEdit,
  onProgressUpdate,
  onStatusChange,
  showProgressDetails = false,
}) {
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
          onProgressUpdate={onProgressUpdate}
          showProgressDetails={showProgressDetails}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  )
}

export default BookGrid
