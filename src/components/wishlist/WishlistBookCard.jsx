import { Link } from 'react-router-dom'
import { getBookPriorityLabel } from '../../constants/bookPriorities'
import { getBookDetailsPath } from '../../constants/routes'
import { usePreferences } from '../../context/usePreferences'
import { formatDateTime } from '../../utils/dateUtils'
import { formatPrice } from '../../utils/formatPrice'

function WishlistBookCard({ book, layout = 'grid', onDelete, onEdit, onPurchase }) {
  const { language, t } = usePreferences()
  const details = [
    book.author ? t('wishlist.detail.author', { value: book.author }) : '',
    book.category ? t('wishlist.detail.category', { value: book.category }) : '',
    book.expectedPrice > 0 ? t('wishlist.detail.price', { value: formatPrice(book.expectedPrice) }) : '',
    book.purchaseStore ? t('wishlist.detail.store', { value: book.purchaseStore }) : '',
    book.createdAt ? t('wishlist.detail.added', { value: formatDateTime(book.createdAt) }) : '',
  ].filter(Boolean)

  return (
    <article className={layout === 'list' ? 'book-list-item wishlist-card' : 'book-card wishlist-card'}>
      <div className="book-card-header">
        <div>
          <h3>{book.title}</h3>
          <p>{t('wishlist.title')}</p>
        </div>
        <span className="book-priority">{getBookPriorityLabel(book.priority, language.value)}</span>
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
          {t('wishlist.purchasedButton')}
        </button>
        <Link className="button button-ghost" to={getBookDetailsPath(book.id)}>
          {t('common.view')}
        </Link>
        <button className="button button-secondary" type="button" onClick={() => onEdit(book)}>
          {t('common.edit')}
        </button>
        <button className="button button-danger-soft" type="button" onClick={() => onDelete(book)}>
          {t('common.delete')}
        </button>
      </div>
    </article>
  )
}

export default WishlistBookCard
