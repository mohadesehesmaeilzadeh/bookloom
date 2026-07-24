import { getBookPriorityLabel } from '../../constants/bookPriorities'
import { getBookStatusLabel } from '../../constants/bookStatuses'

function formatNumber(value) {
  return Number(value).toLocaleString('fa-IR')
}

function BookCard({ book, onDelete, onEdit, onView }) {
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
        <button className="button button-ghost" type="button" onClick={() => onView(book)}>
          مشاهده
        </button>
        <button className="button button-secondary" type="button" onClick={() => onEdit(book)}>
          ویرایش
        </button>
        <button className="button button-danger-soft" type="button" onClick={() => onDelete(book)}>
          حذف
        </button>
      </div>
    </article>
  )
}

export default BookCard
