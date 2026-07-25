import {
  calculateReadingProgress,
  calculateRemainingPages,
  normalizeProgressValues,
} from '../../utils/readingProgress'
import { formatNumber } from '../../utils/formatNumber'

function ReadingProgressBar({
  currentPage,
  totalPages,
  showDetails = true,
  size = 'full',
}) {
  const normalized = normalizeProgressValues({ currentPage, totalPages })
  const progress = calculateReadingProgress(
    normalized.currentPage,
    normalized.totalPages,
  )
  const remainingPages = calculateRemainingPages(
    normalized.currentPage,
    normalized.totalPages,
  )
  const hasKnownTotalPages = normalized.totalPages > 0
  const compact = size === 'compact'

  return (
    <div className={compact ? 'reading-progress compact' : 'reading-progress'}>
      {hasKnownTotalPages ? (
        <>
          <div className="progress-topline">
            <span>
              صفحه {formatNumber(normalized.currentPage)} از{' '}
              {formatNumber(normalized.totalPages)}
            </span>
            <strong>{formatNumber(progress)}٪ مطالعه شده</strong>
          </div>
          <div
            aria-label={`پیشرفت مطالعه ${formatNumber(progress)} درصد`}
            aria-valuemax="100"
            aria-valuemin="0"
            aria-valuenow={progress}
            className="progress-track"
            role="progressbar"
          >
            <span style={{ width: `${progress}%` }} />
          </div>
          {showDetails ? (
            <p>
              {formatNumber(remainingPages)} صفحه باقی مانده
            </p>
          ) : null}
        </>
      ) : (
        <>
          <div className="progress-topline">
            <span>صفحه فعلی: {formatNumber(normalized.currentPage)}</span>
          </div>
          <div
            aria-label="تعداد کل صفحات مشخص نشده است"
            aria-valuemax="100"
            aria-valuemin="0"
            aria-valuenow="0"
            className="progress-track unknown"
            role="progressbar"
          >
            <span style={{ width: '0%' }} />
          </div>
          {showDetails ? <p>تعداد کل صفحات مشخص نشده است.</p> : null}
        </>
      )}
    </div>
  )
}

export default ReadingProgressBar
