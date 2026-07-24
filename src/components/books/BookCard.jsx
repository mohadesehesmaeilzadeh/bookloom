import { Link } from 'react-router-dom'
import { getBookPriorityLabel } from '../../constants/bookPriorities'
import { getBookStatusLabel } from '../../constants/bookStatuses'
import { getBookDetailsPath } from '../../constants/routes'
import BookStatusActions from './BookStatusActions'

function formatNumber(value) {
  return Number(value).toLocaleString('fa-IR')
}

function BookCard({ book, onDelete, onEdit, onStatusChange }) {
  const details = [
    book.author ? `نویسنده: ${book.author}` : '',
    book.category ? `دسته‌بندی: ${book.category}` : '',
    book.totalPages > 0 ? `${formatNumber(book.totalPages)} صفحه` : '',
    book.purchaseDate ? `خرید: ${book.purchaseDate}` : '',
  ].filter(Boolean)

  return (
    <article className="book-card">
      <div className="book-card-header">
        <div>
          <h3>{book.title}</h3>
          <p>{getBookStatusLabel(book.status)}</p>
        </div>
        <span className="book-priority">{getBookPriorityLabel(book.priority)}</span>
      </div>

      {details.length > 0 ? (
        <dl className="book-card-meta">
          {details.map((detail) => (
            <div key={detail}>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="book-card-actions">
        <Link className="button button-ghost" to={getBookDetailsPath(book.id)}>
          مشاهده
        </Link>
        <button className="button button-secondary" type="button" onClick={() => onEdit(book)}>
          ویرایش
        </button>
        <button className="button button-danger-soft" type="button" onClick={() => onDelete(book)}>
          حذف
        </button>
      </div>

      <BookStatusActions book={book} compact onComplete={onStatusChange} />
    </article>
  )
}

export default BookCard
