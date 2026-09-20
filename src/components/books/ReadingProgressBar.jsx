import {
  calculateReadingProgress,
  calculateRemainingPages,
  normalizeProgressValues,
} from '../../utils/readingProgress'
import { formatNumber } from '../../utils/formatNumber'
import { usePreferences } from '../../context/usePreferences'

function ReadingProgressBar({
  currentPage,
  totalPages,
  showDetails = true,
  size = 'full',
}) {
  const { t } = usePreferences()
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
              {t('books.pageOf', {
                current: formatNumber(normalized.currentPage),
                total: formatNumber(normalized.totalPages),
              })}
            </span>
            <strong>{t('books.progressRead', { value: formatNumber(progress) })}</strong>
          </div>
          <div
            aria-label={t('books.progressAria', { value: formatNumber(progress) })}
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
              {t('books.remainingPages', { count: formatNumber(remainingPages) })}
            </p>
          ) : null}
        </>
      ) : (
        <>
          <div className="progress-topline">
            <span>{t('books.currentPage', { page: formatNumber(normalized.currentPage) })}</span>
          </div>
          <div
            aria-label={t('books.unknownTotalPages')}
            aria-valuemax="100"
            aria-valuemin="0"
            aria-valuenow="0"
            className="progress-track unknown"
            role="progressbar"
          >
            <span style={{ width: '0%' }} />
          </div>
          {showDetails ? <p>{t('books.unknownTotalPagesSentence')}</p> : null}
        </>
      )}
    </div>
  )
}

export default ReadingProgressBar
