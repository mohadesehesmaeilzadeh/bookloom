import { getBookPriorityLabel } from '../../constants/bookPriorities'
import { getBookStatusLabel } from '../../constants/bookStatuses'
import Modal from '../common/Modal'

function formatNumber(value) {
  return Number(value).toLocaleString('fa-IR')
}

function formatDateTime(value) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function BookDetailsModal({ book, isOpen, onClose, onEdit }) {
  if (!book) {
    return null
  }

  const rows = [
    ['نام کتاب', book.title],
    ['نویسنده', book.author],
    ['مترجم', book.translator],
    ['انتشارات', book.publisher],
    ['دسته‌بندی', book.category],
    ['وضعیت', getBookStatusLabel(book.status)],
    ['اولویت', getBookPriorityLabel(book.priority)],
    ['تاریخ خرید', book.purchaseDate],
    ['تعداد صفحات', book.totalPages > 0 ? formatNumber(book.totalPages) : ''],
    ['قیمت خرید', book.price > 0 ? formatNumber(book.price) : ''],
    ['قیمت تقریبی', book.expectedPrice > 0 ? formatNumber(book.expectedPrice) : ''],
    ['فروشگاه', book.purchaseStore],
    ['یادداشت', book.notes],
    ['تاریخ ثبت', formatDateTime(book.createdAt)],
    ['آخرین ویرایش', formatDateTime(book.updatedAt)],
  ].filter(([, value]) => value !== '')

  return (
    <Modal isOpen={isOpen} title="جزئیات کتاب" onClose={onClose}>
      <div className="book-details">
        <dl>
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="form-actions">
          <button className="button button-secondary" type="button" onClick={onClose}>
            بستن
          </button>
          <button className="button button-primary" type="button" onClick={() => onEdit(book)}>
            ویرایش کتاب
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default BookDetailsModal
