import { Link } from 'react-router-dom'
import { BOOK_STATUS, getBookStatusLabel } from '../../constants/bookStatuses'
import { getBookPriorityLabel } from '../../constants/bookPriorities'
import { getBookDetailsPath } from '../../constants/routes'
import { RECOMMENDATION_MODE } from '../../constants/recommendationModes'
import { createScoreBreakdownRows, formatRecommendationScore } from '../../utils/bookRecommendations'
import { formatDate } from '../../utils/dateUtils'
import { formatNumber } from '../../utils/formatNumber'

function RecommendationResult({
  onClose,
  onGenerateAnother,
  onStartReading,
  recommendation,
}) {
  const book = recommendation?.book

  if (!book) {
    return (
      <div className="empty-state recommendation-empty">
        <h3>{recommendation?.message ?? 'در حال حاضر کتابی برای پیشنهاد وجود ندارد.'}</h3>
        <p>کتابی با وضعیت خریداری‌شده به کتابخانه اضافه کن یا یکی از کتاب‌های متوقف‌شده را نگه دار.</p>
      </div>
    )
  }

  const scoreRows =
    recommendation.mode === RECOMMENDATION_MODE.WEIGHTED
      ? createScoreBreakdownRows(recommendation.scoreBreakdown)
      : []

  return (
    <article className="recommendation-result">
      <div className="dashboard-item-header">
        <div>
          <h3>{book.title}</h3>
          {book.author ? <p>{book.author}</p> : null}
        </div>
        <span className="book-priority">{getBookStatusLabel(book.status)}</span>
      </div>

      <dl className="recommendation-meta">
        {book.category ? (
          <div>
            <dt>دسته‌بندی</dt>
            <dd>{book.category}</dd>
          </div>
        ) : null}
        <div>
          <dt>اولویت</dt>
          <dd>{getBookPriorityLabel(book.priority)}</dd>
        </div>
        {book.totalPages > 0 ? (
          <div>
            <dt>تعداد صفحات</dt>
            <dd>{formatNumber(book.totalPages)}</dd>
          </div>
        ) : null}
        {book.purchaseDate ? (
          <div>
            <dt>تاریخ خرید</dt>
            <dd>{formatDate(book.purchaseDate)}</dd>
          </div>
        ) : null}
        {book.status === BOOK_STATUS.PAUSED ? (
          <div>
            <dt>صفحه فعلی</dt>
            <dd>{formatNumber(book.currentPage)}</dd>
          </div>
        ) : null}
      </dl>

      <div className="recommendation-reasons">
        <h4>چرا این کتاب؟</h4>
        <ul>
          {recommendation.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>

      {recommendation.mode === RECOMMENDATION_MODE.WEIGHTED ? (
        <div className="score-breakdown">
          <strong>امتیاز پیشنهاد: {formatRecommendationScore(recommendation.totalScore)}</strong>
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
          مشاهده جزئیات
        </Link>
        <button className="button button-primary" type="button" onClick={() => onStartReading(book)}>
          {book.status === BOOK_STATUS.PAUSED ? 'ادامه مطالعه' : 'شروع مطالعه'}
        </button>
        <button className="button button-ghost" type="button" onClick={onGenerateAnother}>
          پیشنهاد دوباره
        </button>
        <button className="button button-secondary" type="button" onClick={onClose}>
          بستن
        </button>
      </div>
    </article>
  )
}

export default RecommendationResult
