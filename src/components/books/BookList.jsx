import BookListItem from './BookListItem'

function BookList({
  books,
  onDelete,
  onEdit,
  onProgressUpdate,
  onStatusChange,
  showProgressDetails = false,
}) {
  return (
    <div className="book-list">
      {books.map((book) => (
        <BookListItem
          book={book}
          key={book.id}
          onDelete={onDelete}
          onEdit={onEdit}
          onProgressUpdate={onProgressUpdate}
          onStatusChange={onStatusChange}
          showProgressDetails={showProgressDetails}
        />
      ))}
    </div>
  )
}

export default BookList
