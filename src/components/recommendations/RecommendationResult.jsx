import { Link } from 'react-router-dom'
import { BOOK_STATUS, getBookStatusLabel } from '../../constants/bookStatuses'
import { getBookPriorityLabel } from '../../constants/bookPriorities'
import { getBookDetailsPath } from '../../constants/routes'
import { RECOMMENDATION_MODE } from '../../constants/recommendationModes'
import { createScoreBreakdownRows, formatRecommendationScore } from '../../utils/bookRecommendations'
import { formatDate } from '../../utils/dateUtils'
import { formatNumber } from '../../utils/formatNumber'
import { usePreferences } from '../../context/usePreferences'

function RecommendationResult({
  onClose,
  onGenerateAnother,
  onStartReading,
  recommendation,
}) {
  const { language, t } = usePreferences()
  const book = recommendation?.book

  if (!book) {
    return (
      <div className="empty-state recommendation-empty">
        <h3>{recommendation?.message ?? t('recommendation.none')}</h3>
        <p>{t('recommendation.noEligibleDescription')}</p>
      </div>
    )
  }

  const scoreRows =
    recommendation.mode === RECOMMENDATION_MODE.WEIGHTED
      ? createScoreBreakdownRows(recommendation.scoreBreakdown, language.value)
      : []

  return (
    <article className="recommendation-result">
      <div className="dashboard-item-header">
        <div>
          <h3>{book.title}</h3>
          {book.author ? <p>{book.author}</p> : null}
        </div>
        <span className="book-priority">{getBookStatusLabel(book.status, language.value)}</span>
      </div>

      <dl className="recommendation-meta">
        {book.category ? (
          <div>
            <dt>{t('bookFields.category')}</dt>
            <dd>{book.category}</dd>
          </div>
        ) : null}
        <div>
          <dt>{t('bookFields.priority')}</dt>
          <dd>{getBookPriorityLabel(book.priority, language.value)}</dd>
        </div>
        {book.totalPages > 0 ? (
          <div>
            <dt>{t('bookFields.totalPages')}</dt>
            <dd>{formatNumber(book.totalPages)}</dd>
          </div>
        ) : null}
        {book.purchaseDate ? (
          <div>
            <dt>{t('bookFields.purchaseDate')}</dt>
            <dd>{formatDate(book.purchaseDate)}</dd>
          </div>
        ) : null}
        {book.status === BOOK_STATUS.PAUSED ? (
          <div>
            <dt>{t('bookFields.currentPage')}</dt>
            <dd>{formatNumber(book.currentPage)}</dd>
          </div>
        ) : null}
      </dl>

      <div className="recommendation-reasons">
        <h4>{t('recommendation.why')}</h4>
        <ul>
          {recommendation.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>

      {recommendation.mode === RECOMMENDATION_MODE.WEIGHTED ? (
        <div className="score-breakdown">
          <strong>
            {t('recommendation.score', {
              score: formatRecommendationScore(recommendation.totalScore),
            })}
          </strong>
          {scoreRows.length > 0 ? (
            <dl>
              {scoreRows.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{formatNumber(value)}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      ) : null}

      <div className="form-actions">
        <Link className="button button-secondary" to={getBookDetailsPath(book.id)} onClick={onClose}>
          {t('common.viewDetails')}
        </Link>
        <button className="button button-primary" type="button" onClick={() => onStartReading(book)}>
          {book.status === BOOK_STATUS.PAUSED
            ? t('statusAction.resume-reading.label')
            : t('statusAction.start-reading.label')}
        </button>
        <button className="button button-ghost" type="button" onClick={onGenerateAnother}>
          {t('recommendation.startAgain')}
        </button>
        <button className="button button-secondary" type="button" onClick={onClose}>
          {t('common.close')}
        </button>
      </div>
    </article>
  )
}

export default RecommendationResult
