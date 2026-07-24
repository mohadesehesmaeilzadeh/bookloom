import { formatDateTime } from '../../utils/dateUtils'
import { formatNumber } from '../../utils/formatNumber'

function QuoteCard({ onDelete, onEdit, quote }) {
  return (
    <li className="quote-card">
      <blockquote>{quote.text}</blockquote>
      {quote.pageNumber !== '' ? (
        <p className="quote-meta">صفحه {formatNumber(quote.pageNumber)}</p>
      ) : null}
      {quote.personalNote ? (
        <div className="quote-note">
          <strong>یادداشت من:</strong>
          <p>{quote.personalNote}</p>
        </div>
      ) : null}
      <p className="quote-meta">
        {quote.updatedAt && quote.updatedAt !== quote.createdAt
          ? `آخرین ویرایش: ${formatDateTime(quote.updatedAt)}`
          : `ثبت شده: ${formatDateTime(quote.createdAt)}`}
      </p>
      <div className="form-actions">
        <button className="button button-secondary" type="button" onClick={() => onEdit(quote)}>
          ویرایش
        </button>
        <button className="button button-danger-soft" type="button" onClick={() => onDelete(quote)}>
          حذف
        </button>
      </div>
    </li>
  )
}

export default QuoteCard
