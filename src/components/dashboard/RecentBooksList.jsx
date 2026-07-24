import { Link } from 'react-router-dom'
import { getBookStatusLabel } from '../../constants/bookStatuses'
import { getBookDetailsPath } from '../../constants/routes'
import { formatDate } from '../../utils/dateUtils'
import { formatNumber } from '../../utils/formatNumber'

function RecentBooksList({ books, dateField, emptyMessage, showPages = false, title }) {
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
                  {[book.author, getBookStatusLabel(book.status), formatDate(book[dateField])]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
                {showPages && book.totalPages > 0 ? (
                  <span>{formatNumber(book.totalPages)} صفحه</span>
                ) : null}
              </div>
              <Link className="inline-link" to={getBookDetailsPath(book.id)}>
                جزئیات
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
