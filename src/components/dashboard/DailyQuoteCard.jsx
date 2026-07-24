import { Link } from 'react-router-dom'
import { getBookDetailsPath, ROUTES } from '../../constants/routes'
import { formatNumber } from '../../utils/formatNumber'

function DailyQuoteCard({ quoteItem }) {
  return (
    <section className="dashboard-section" aria-labelledby="daily-quote-title">
      <div className="library-header">
        <div>
          <h2 id="daily-quote-title">نقل‌قول امروز</h2>
          <p>یک نقل‌قول ذخیره‌شده بر اساس تاریخ امروز انتخاب می‌شود.</p>
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
            <span>صفحه {formatNumber(quoteItem.quote.pageNumber)}</span>
          ) : null}
          <Link className="button button-secondary" to={getBookDetailsPath(quoteItem.bookId)}>
            مشاهده کتاب
          </Link>
        </article>
      ) : (
        <div className="empty-state">
          <h3>هنوز نقل‌قولی ثبت نکرده‌ای.</h3>
          <p>از صفحه جزئیات کتاب‌ها جمله‌های موردعلاقه‌ات را ذخیره کن.</p>
          <Link className="button button-primary" to={ROUTES.LIBRARY}>
            رفتن به کتابخانه
          </Link>
        </div>
      )}
    </section>
  )
}

export default DailyQuoteCard
