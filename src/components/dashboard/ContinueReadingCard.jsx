import { Link } from 'react-router-dom'
import { BOOK_STATUS, getBookStatusLabel } from '../../constants/bookStatuses'
import { getBookDetailsPath, ROUTES } from '../../constants/routes'
import { formatDateTime } from '../../utils/dateUtils'
import { formatNumber } from '../../utils/formatNumber'
import { getBookProgressSummary } from '../../utils/dashboardStatistics'
import { usePreferences } from '../../context/usePreferences'
import ReadingProgressBar from '../books/ReadingProgressBar'

function ContinueReadingCard({ book, onUpdateProgress }) {
  const { language, t } = usePreferences()

  if (!book) {
    return (
      <div className="empty-state">
        <h3>{t('dashboard.continue.emptyTitle')}</h3>
        <p>{t('dashboard.continue.emptyDescription')}</p>
        <Link className="button button-primary" to={ROUTES.LIBRARY}>
          {t('dashboard.goLibrary')}
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
        <span className="book-priority">{getBookStatusLabel(book.status, language.value)}</span>
      </div>

      <ReadingProgressBar
        currentPage={book.currentPage}
        showDetails
        totalPages={book.totalPages}
      />

      <dl className="dashboard-inline-metrics">
        <div>
          <dt>{t('dashboard.continue.currentPage')}</dt>
          <dd>{formatNumber(progress.currentPage)}</dd>
        </div>
        <div>
          <dt>{t('dashboard.continue.totalPages')}</dt>
          <dd>{progress.totalPages > 0 ? formatNumber(progress.totalPages) : t('common.unknown')}</dd>
        </div>
        <div>
          <dt>{t('dashboard.goal.remaining')}</dt>
          <dd>
            {progress.remainingPages === null
              ? t('common.unknown')
              : t('books.remainingPages', { count: formatNumber(progress.remainingPages) })}
          </dd>
        </div>
      </dl>

      {book.lastProgressUpdate ? (
        <p className="progress-updated">
          {t('dashboard.continue.lastUpdated', { date: formatDateTime(book.lastProgressUpdate) })}
        </p>
      ) : null}

      <div className="form-actions">
        <Link className="button button-secondary" to={getBookDetailsPath(book.id)}>
          {t('common.viewDetails')}
        </Link>
        {book.status === BOOK_STATUS.READING || book.status === BOOK_STATUS.PAUSED ? (
          <button
            className="button button-primary"
            type="button"
            onClick={() => onUpdateProgress(book)}
          >
            {t('dashboard.continue.updateProgress')}
          </button>
        ) : null}
      </div>
    </article>
  )
}

export default ContinueReadingCard
