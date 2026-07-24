import { Link } from 'react-router-dom'
import { BOOK_STATUS, getBookStatusLabel } from '../../constants/bookStatuses'
import { getBookDetailsPath, ROUTES } from '../../constants/routes'
import { formatDateTime } from '../../utils/dateUtils'
import { formatNumber } from '../../utils/formatNumber'
import { getBookProgressSummary } from '../../utils/dashboardStatistics'
import ReadingProgressBar from '../books/ReadingProgressBar'

function ContinueReadingCard({ book, onUpdateProgress }) {
  if (!book) {
    return (
      <div className="empty-state">
        <h3>در حال حاضر کتابی برای ادامه مطالعه نداری.</h3>
        <p>از کتابخانه یکی از کتاب‌ها را شروع کن.</p>
        <Link className="button button-primary" to={ROUTES.LIBRARY}>
          رفتن به کتابخانه
        </Link>
      </div>
    )
  }

  const progress = getBookProgressSummary(book)

  return (
    <article className="continue-reading-card dashboard-panel">
      <div className="dashboard-item-header">
        <div>
          <h3>{book.title}</h3>
          {book.author ? <p>{book.author}</p> : null}
        </div>
        <span className="book-priority">{getBookStatusLabel(book.status)}</span>
      </div>

      <ReadingProgressBar
        currentPage={book.currentPage}
        showDetails
        totalPages={book.totalPages}
      />

      <dl className="dashboard-inline-metrics">
        <div>
          <dt>صفحه فعلی</dt>
          <dd>{formatNumber(progress.currentPage)}</dd>
        </div>
        <div>
          <dt>کل صفحات</dt>
          <dd>{progress.totalPages > 0 ? formatNumber(progress.totalPages) : 'نامشخص'}</dd>
        </div>
        <div>
          <dt>باقی‌مانده</dt>
          <dd>
            {progress.remainingPages === null
              ? 'نامشخص'
              : `${formatNumber(progress.remainingPages)} صفحه`}
          </dd>
        </div>
      </dl>

      {book.lastProgressUpdate ? (
        <p className="progress-updated">
          آخرین به‌روزرسانی: {formatDateTime(book.lastProgressUpdate)}
        </p>
      ) : null}

      <div className="form-actions">
        <Link className="button button-secondary" to={getBookDetailsPath(book.id)}>
          مشاهده جزئیات
        </Link>
        {book.status === BOOK_STATUS.READING || book.status === BOOK_STATUS.PAUSED ? (
          <button
            className="button button-primary"
            type="button"
            onClick={() => onUpdateProgress(book)}
          >
            به‌روزرسانی پیشرفت
          </button>
        ) : null}
      </div>
    </article>
  )
}

export default ContinueReadingCard
