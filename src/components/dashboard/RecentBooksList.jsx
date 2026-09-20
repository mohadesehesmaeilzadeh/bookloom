import { Link } from 'react-router-dom'
import { getBookStatusLabel } from '../../constants/bookStatuses'
import { getBookDetailsPath } from '../../constants/routes'
import { usePreferences } from '../../context/usePreferences'
import { formatDate } from '../../utils/dateUtils'
import { formatNumber } from '../../utils/formatNumber'

function RecentBooksList({ books, dateField, emptyMessage, showPages = false, title }) {
  const { language, t } = usePreferences()

  return (
    <section className="dashboard-section" aria-labelledby={`${dateField}-title`}>
      <div className="library-header">
        <div>
          <h2 id={`${dateField}-title`}>{title}</h2>
        </div>
      </div>

      {books.length > 0 ? (
        <ul className="dashboard-list">
          {books.map((book) => (
            <li className="dashboard-list-item" key={book.id}>
              <div>
                <p>{book.title}</p>
                <span>
                  {[book.author, getBookStatusLabel(book.status, language.value), formatDate(book[dateField])]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
                {showPages && book.totalPages > 0 ? (
                  <span>{t('dashboard.pageCount', { count: formatNumber(book.totalPages) })}</span>
                ) : null}
              </div>
              <Link className="inline-link" to={getBookDetailsPath(book.id)}>
                {t('common.details')}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <h3>{emptyMessage}</h3>
        </div>
      )}
    </section>
  )
}

export default RecentBooksList
