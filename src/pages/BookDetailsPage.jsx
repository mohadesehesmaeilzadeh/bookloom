import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BookFormModal from '../components/books/BookFormModal'
import BookStatusActions from '../components/books/BookStatusActions'
import ConfirmDialog from '../components/common/ConfirmDialog'
import FeedbackMessage from '../components/common/FeedbackMessage'
import PurchaseBookModal from '../components/wishlist/PurchaseBookModal'
import { getBookPriorityLabel } from '../constants/bookPriorities'
import { BOOK_STATUS, getBookStatusLabel } from '../constants/bookStatuses'
import { ROUTES } from '../constants/routes'
import { useBooksContext } from '../context/useBooksContext'
import { formatPrice } from '../utils/formatPrice'
import { formatDateTime } from '../utils/dateUtils'
import { createPurchaseConversionPayload } from '../utils/wishlist/purchaseConversion'

function BookDetailsPage() {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const { deleteBook, getBookById, updateBook } = useBooksContext()
  const book = getBookById(bookId)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const dismissFeedback = useCallback(() => setFeedback(''), [])

  if (!book) {
    return (
      <section className="placeholder-page" aria-labelledby="missing-book-title">
        <h2 id="missing-book-title">کتاب پیدا نشد</h2>
        <p>کتابی با این شناسه در Bookloom وجود ندارد یا قبلاً حذف شده است.</p>
        <Link className="button button-primary" to={ROUTES.LIBRARY}>
          بازگشت به کتابخانه
        </Link>
      </section>
    )
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
    ['تاریخ شروع مطالعه', book.readingStartDate],
    ['تاریخ پایان مطالعه', book.readingEndDate],
    ['تعداد صفحات', book.totalPages > 0 ? book.totalPages.toLocaleString('fa-IR') : ''],
    ['قیمت خرید', formatPrice(book.price)],
    ['قیمت تقریبی', formatPrice(book.expectedPrice)],
    ['فروشگاه', book.purchaseStore],
    ['یادداشت', book.notes],
    ['تاریخ ثبت', formatDateTime(book.createdAt)],
    ['آخرین ویرایش', formatDateTime(book.updatedAt)],
  ].filter(([, value]) => value !== '')

  function handleEditSubmit(payload) {
    const result = updateBook(book.id, payload)

    if (result.success) {
      setFeedback('تغییرات کتاب ذخیره شد.')
      setIsEditOpen(false)
    }
  }

  function handleDeleteConfirm() {
    setIsDeleting(true)
    const result = deleteBook(book.id)
    setIsDeleting(false)

    if (result.success) {
      navigate(ROUTES.LIBRARY, { replace: true })
    }
  }

  function handlePurchaseConfirm(purchaseValues) {
    const result = updateBook(book.id, createPurchaseConversionPayload(purchaseValues))

    if (result.success) {
      setFeedback('کتاب با موفقیت به کتابخانه اضافه شد.')
      setIsPurchaseOpen(false)
    }
  }

  const isWishlistBook = book.status === BOOK_STATUS.WISHLIST

  return (
    <section className="book-details-page" aria-labelledby="book-details-title">
      <div className="library-header">
        <div>
          <h2 id="book-details-title">{book.title}</h2>
          <p>اطلاعات پایه کتاب و وضعیت مطالعه را از اینجا مدیریت کنید.</p>
        </div>
        <div className="form-actions">
          <Link className="button button-secondary" to={ROUTES.LIBRARY}>
            بازگشت به کتابخانه
          </Link>
          <button className="button button-primary" type="button" onClick={() => setIsEditOpen(true)}>
            ویرایش کتاب
          </button>
          {isWishlistBook ? (
            <button
              className="button button-primary"
              type="button"
              onClick={() => setIsPurchaseOpen(true)}
            >
              خریدمش
            </button>
          ) : null}
          <button className="button button-danger-soft" type="button" onClick={() => setIsDeleteOpen(true)}>
            حذف
          </button>
        </div>
      </div>

      <FeedbackMessage message={feedback} onDismiss={dismissFeedback} />

      {isWishlistBook ? (
        <div className="details-section">
          <h3>خرید کتاب</h3>
          <p className="muted-note">
            این کتاب هنوز در لیست خرید است. برای انتقال همان رکورد به کتابخانه،
            خرید را ثبت کن.
          </p>
          <div className="status-actions">
            <button
              className="button button-primary"
              type="button"
              onClick={() => setIsPurchaseOpen(true)}
            >
              خریدمش
            </button>
          </div>
        </div>
      ) : (
        <div className="details-section">
          <h3>وضعیت مطالعه</h3>
          <BookStatusActions book={book} onComplete={setFeedback} />
        </div>
      )}

      <div className="details-section book-details">
        <h3>اطلاعات کتاب</h3>
        <dl>
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <BookFormModal
        book={book}
        isOpen={isEditOpen}
        mode="edit"
        variant={isWishlistBook ? 'wishlist' : 'default'}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
      />

      <PurchaseBookModal
        book={book}
        isOpen={isPurchaseOpen}
        onClose={() => setIsPurchaseOpen(false)}
        onConfirm={handlePurchaseConfirm}
      />

      <ConfirmDialog
        confirmLabel="حذف کتاب"
        isConfirming={isDeleting}
        isOpen={isDeleteOpen}
        message={`آیا از حذف کتاب «${book.title}» مطمئن هستید؟ این کار قابل بازگشت نیست.`}
        title="حذف کتاب"
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </section>
  )
}

export default BookDetailsPage
