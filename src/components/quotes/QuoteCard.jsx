import { formatDateTime } from '../../utils/dateUtils'
import { formatNumber } from '../../utils/formatNumber'
import { usePreferences } from '../../context/usePreferences'

function QuoteCard({ onDelete, onEdit, quote }) {
  const { t } = usePreferences()

  return (
    <li className="quote-card">
      <blockquote>{quote.text}</blockquote>
      {quote.pageNumber !== '' ? (
        <p className="quote-meta">{t('quotes.page', { page: formatNumber(quote.pageNumber) })}</p>
      ) : null}
      {quote.personalNote ? (
        <div className="quote-note">
          <strong>{t('quotes.myNote')}</strong>
          <p>{quote.personalNote}</p>
        </div>
      ) : null}
      <p className="quote-meta">
        {quote.updatedAt && quote.updatedAt !== quote.createdAt
          ? t('quotes.lastEdited', { date: formatDateTime(quote.updatedAt) })
          : t('quotes.created', { date: formatDateTime(quote.createdAt) })}
      </p>
      <div className="form-actions">
        <button className="button button-secondary" type="button" onClick={() => onEdit(quote)}>
          {t('common.edit')}
        </button>
        <button className="button button-danger-soft" type="button" onClick={() => onDelete(quote)}>
          {t('common.delete')}
        </button>
      </div>
    </li>
  )
}

export default QuoteCard
