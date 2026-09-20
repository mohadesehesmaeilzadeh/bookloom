import { Link } from 'react-router-dom'
import { getBookPriorityLabel } from '../../constants/bookPriorities'
import { getBookStatusLabel } from '../../constants/bookStatuses'
import { getBookDetailsPath } from '../../constants/routes'
import { BOOK_STATUS } from '../../constants/bookStatuses'
import { usePreferences } from '../../context/usePreferences'
import { formatDateTime } from '../../utils/dateUtils'
import { formatNumber } from '../../utils/formatNumber'
import BookStatusActions from './BookStatusActions'
import BookRating from './BookRating'
import ReadingProgressBar from './ReadingProgressBar'

function BookCard({
  book,
  onDelete,
  onEdit,
  onProgressUpdate,
  onStatusChange,
  showProgressDetails = false,
}) {
  const { language, t } = usePreferences()
  const showProgress =
    book.status === BOOK_STATUS.READING ||
    book.status === BOOK_STATUS.PAUSED ||
    (book.status === BOOK_STATUS.FINISHED && book.totalPages > 0)
  const details = [
    book.author ? `${t('bookFields.author')}: ${book.author}` : '',
    book.category ? `${t('bookFields.category')}: ${book.category}` : '',
    book.totalPages > 0
      ? `${formatNumber(book.totalPages)} ${t('common.pages')}`
      : '',
    book.purchaseDate ? `${t('bookFields.purchase')}: ${book.purchaseDate}` : '',
  ].filter(Boolean)

  return (
    <article className="book-card">
      <div className="book-card-header">
        <div>
          <h3>{book.title}</h3>
          <p>{getBookStatusLabel(book.status, language.value)}</p>
        </div>
        <span className="book-priority">
          {getBookPriorityLabel(book.priority, language.value)}
        </span>
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
              {t('books.lastProgressUpdate')}: {formatDateTime(book.lastProgressUpdate)}
            </p>
          ) : null}
        </div>
      ) : null}

      {book.rating > 0 || (book.status === BOOK_STATUS.FINISHED && (book.personalReview || book.quotes?.length > 0)) ? (
        <div className="card-insights">
          {book.rating > 0 ? <BookRating rating={book.rating} readOnly /> : null}
          {book.status === BOOK_STATUS.FINISHED && book.personalReview ? (
            <p>{book.personalReview}</p>
          ) : null}
          {book.status === BOOK_STATUS.FINISHED && book.quotes?.length > 0 ? (
            <span>{t('bookFields.quotesCount', { count: formatNumber(book.quotes.length) })}</span>
          ) : null}
        </div>
      ) : null}

      <div className="book-card-actions">
        <Link className="button button-ghost" to={getBookDetailsPath(book.id)}>
          {t('common.view')}
        </Link>
        <button className="button button-secondary" type="button" onClick={() => onEdit(book)}>
          {t('common.edit')}
        </button>
        <button className="button button-danger-soft" type="button" onClick={() => onDelete(book)}>
          {t('common.delete')}
        </button>
      </div>

      {book.status === BOOK_STATUS.READING || book.status === BOOK_STATUS.PAUSED ? (
        <div className="book-card-actions">
          <button
            className="button button-primary"
            type="button"
            onClick={() => onProgressUpdate?.(book)}
          >
            {t('books.updateProgress')}
          </button>
        </div>
      ) : null}

      <BookStatusActions book={book} compact onComplete={onStatusChange} />
    </article>
  )
}

export default BookCard
