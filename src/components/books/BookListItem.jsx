import { Link } from 'react-router-dom'
import { getBookPriorityLabel } from '../../constants/bookPriorities'
import { BOOK_STATUS, getBookStatusLabel } from '../../constants/bookStatuses'
import { getBookDetailsPath } from '../../constants/routes'
import { formatPrice } from '../../utils/formatPrice'
import BookStatusActions from './BookStatusActions'
import BookRating from './BookRating'
import ReadingProgressBar from './ReadingProgressBar'

function BookListItem({
  book,
  onDelete,
  onEdit,
  onProgressUpdate,
  onStatusChange,
  showProgressDetails = false,
}) {
  const showProgress =
    book.status === BOOK_STATUS.READING ||
    book.status === BOOK_STATUS.PAUSED ||
    (book.status === BOOK_STATUS.FINISHED && book.totalPages > 0)

  return (
    <article className="book-list-item">
      <div className="list-main">
        <h3>{book.title}</h3>
        <p>
          {[book.author, book.category, getBookStatusLabel(book.status)]
            .filter(Boolean)
            .join(' · ')}
        </p>
        <span>{getBookPriorityLabel(book.priority)}</span>
        {book.rating > 0 ? <BookRating rating={book.rating} readOnly /> : null}
        {book.status === BOOK_STATUS.FINISHED && book.quotes?.length > 0 ? (
          <span>{book.quotes.length.toLocaleString('fa-IR')} نقل‌قول</span>
        ) : null}
      </div>

      {showProgress ? (
        <div className="list-progress">
          <ReadingProgressBar
            currentPage={book.currentPage}
            showDetails={showProgressDetails}
            size="compact"
            totalPages={book.totalPages}
          />
        </div>
      ) : book.price > 0 || book.expectedPrice > 0 ? (
        <p className="list-price">{formatPrice(book.price || book.expectedPrice)}</p>
      ) : null}

      <div className="book-card-actions">
        <Link className="button button-ghost" to={getBookDetailsPath(book.id)}>
          مشاهده
        </Link>
        <button className="button button-secondary" type="button" onClick={() => onEdit(book)}>
          ویرایش
        </button>
        <button className="button button-danger-soft" type="button" onClick={() => onDelete(book)}>
          حذف
        </button>
      </div>

      {book.status === BOOK_STATUS.READING || book.status === BOOK_STATUS.PAUSED ? (
        <div className="book-card-actions">
          <button
            className="button button-primary"
            type="button"
            onClick={() => onProgressUpdate?.(book)}
          >
            به‌روزرسانی پیشرفت
          </button>
          <BookStatusActions book={book} compact onComplete={onStatusChange} />
        </div>
      ) : (
        <BookStatusActions book={book} compact onComplete={onStatusChange} />
      )}
    </article>
  )
}

export default BookListItem
