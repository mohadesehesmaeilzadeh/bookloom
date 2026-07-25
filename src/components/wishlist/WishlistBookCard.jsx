import { Link } from 'react-router-dom'
import { getBookPriorityLabel } from '../../constants/bookPriorities'
import { getBookDetailsPath } from '../../constants/routes'
import { formatDateTime } from '../../utils/dateUtils'
import { formatPrice } from '../../utils/formatPrice'

function WishlistBookCard({ book, layout = 'grid', onDelete, onEdit, onPurchase }) {
  const details = [
    book.author ? `نویسنده: ${book.author}` : '',
    book.category ? `دسته‌بندی: ${book.category}` : '',
    book.expectedPrice > 0 ? `قیمت تقریبی: ${formatPrice(book.expectedPrice)}` : '',
    book.purchaseStore ? `فروشگاه پیشنهادی: ${book.purchaseStore}` : '',
    book.createdAt ? `افزوده‌شده: ${formatDateTime(book.createdAt)}` : '',
  ].filter(Boolean)

  return (
    <article className={layout === 'list' ? 'book-list-item wishlist-card' : 'book-card wishlist-card'}>
      <div className="book-card-header">
        <div>
          <h3>{book.title}</h3>
          <p>لیست خرید</p>
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

      <div className="book-card-actions wishlist-card-actions">
        <button
          className="button button-primary"
          type="button"
          onClick={() => onPurchase(book)}
        >
          خریدمش
        </button>
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
    </article>
  )
}

export default WishlistBookCard
