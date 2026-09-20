import { Link } from 'react-router-dom'
import { getBookDetailsPath, ROUTES } from '../../constants/routes'
import { usePreferences } from '../../context/usePreferences'
import { formatNumber } from '../../utils/formatNumber'

function DailyQuoteCard({ quoteItem }) {
  const { t } = usePreferences()

  return (
    <section className="dashboard-section" aria-labelledby="daily-quote-title">
      <div className="library-header">
        <div>
          <h2 id="daily-quote-title">{t('dashboard.quote.title')}</h2>
          <p>{t('dashboard.quote.description')}</p>
        </div>
      </div>

      {quoteItem ? (
        <article className="dashboard-panel daily-quote-card">
          <blockquote>{quoteItem.quote.text}</blockquote>
          <p>
            {quoteItem.bookTitle}
            {quoteItem.author ? ` · ${quoteItem.author}` : ''}
          </p>
          {quoteItem.quote.pageNumber !== '' ? (
            <span>{t('dashboard.quote.page', { page: formatNumber(quoteItem.quote.pageNumber) })}</span>
          ) : null}
          <Link className="button button-secondary" to={getBookDetailsPath(quoteItem.bookId)}>
            {t('dashboard.quote.viewBook')}
          </Link>
        </article>
      ) : (
        <div className="empty-state">
          <h3>{t('dashboard.quote.emptyTitle')}</h3>
          <p>{t('dashboard.quote.emptyDescription')}</p>
          <Link className="button button-primary" to={ROUTES.LIBRARY}>
            {t('dashboard.goLibrary')}
          </Link>
        </div>
      )}
    </section>
  )
}

export default DailyQuoteCard
