import { Link } from 'react-router-dom'
import { getBookPriorityLabel } from '../../constants/bookPriorities'
import { getBookStatusLabel } from '../../constants/bookStatuses'
import { getBookDetailsPath } from '../../constants/routes'
import { BOOK_STATUS } from '../../constants/bookStatuses'
import { formatDateTime } from '../../utils/dateUtils'
import BookStatusActions from './BookStatusActions'
import ReadingProgressBar from './ReadingProgressBar'

function formatNumber(value) {
  return Number(value).toLocaleString('fa-IR')
}

function BookCard({
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
  const details = [
    book.author ? `نویسنده: ${book.author}` : '',
    book.category ? `دسته‌بندی: ${book.category}` : '',
    book.totalPages > 0 ? `${formatNumber(book.totalPages)} صفحه` : '',
    book.purchaseDate ? `خرید: ${book.purchaseDate}` : '',
  ].filter(Boolean)

  return (
    <article className="book-card">
      <div className="book-card-header">
        <div>
          <h3>{book.title}</h3>
          <p>{getBookStatusLabel(book.status)}</p>
        </div>
        <span className="book-priority">{getBookPriorityLabel(book.priority)}</span>
      </div>

      {details.length > 0 ? (
        <dl className="book-card-meta">
          {details.map((detail) => (
            <div key={detail}>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {showProgress ? (
        <div className="card-progress">
          <ReadingProgressBar
            currentPage={book.currentPage}
            showDetails={showProgressDetails}
            size="compact"
            totalPages={book.totalPages}
          />
          {book.lastProgressUpdate ? (
            <p className="progress-updated">
              آخرین به‌روزرسانی: {formatDateTime(book.lastProgressUpdate)}
            </p>
          ) : null}
        </div>
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
        </div>
      ) : null}

      <BookStatusActions book={book} compact onComplete={onStatusChange} />
    </article>
  )
}

export default BookCard
