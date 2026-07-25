import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BookFormModal from '../components/books/BookFormModal'
import BookNotesSection from '../components/books/BookNotesSection'
import BookReviewSection from '../components/books/BookReviewSection'
import ProgressUpdateController from '../components/books/ProgressUpdateController'
import ReadingProgressBar from '../components/books/ReadingProgressBar'
import BookStatusActions from '../components/books/BookStatusActions'
import ConfirmDialog from '../components/common/ConfirmDialog'
import FeedbackMessage from '../components/common/FeedbackMessage'
import BookQuotesSection from '../components/quotes/BookQuotesSection'
import PurchaseBookModal from '../components/wishlist/PurchaseBookModal'
import { getBookPriorityLabel } from '../constants/bookPriorities'
import { BOOK_STATUS, getBookStatusLabel } from '../constants/bookStatuses'
import { ROUTES } from '../constants/routes'
import { useBooksContext } from '../context/useBooksContext'
import { usePreferences } from '../context/usePreferences'
import { formatDate, formatDateTime } from '../utils/dateUtils'
import { formatNumber } from '../utils/formatNumber'
import { formatPrice } from '../utils/formatPrice'
import { calculateReadingProgress } from '../utils/readingProgress'
import { createPurchaseConversionPayload } from '../utils/wishlist/purchaseConversion'

function DetailsList({ rows }) {
  const visibleRows = rows.filter(([, value]) => value !== '' && value !== null && value !== undefined)

  if (visibleRows.length === 0) {
    return <p className="muted-note">اطلاعاتی برای نمایش وجود ندارد.</p>
  }

  return (
    <dl>
      {visibleRows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}

function BookDetailsPage() {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const { deleteBook, getBookById, updateBook } = useBooksContext()
  const { preferences } = usePreferences()
  const book = getBookById(bookId)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false)
  const [isProgressOpen, setIsProgressOpen] = useState(false)
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

  const isWishlistBook = book.status === BOOK_STATUS.WISHLIST
  const canUpdateProgress =
    book.status === BOOK_STATUS.READING || book.status === BOOK_STATUS.PAUSED
  const shouldShowProgress =
    canUpdateProgress ||
    (book.status === BOOK_STATUS.FINISHED && book.totalPages > 0)
  const progress = calculateReadingProgress(book.currentPage, book.totalPages)
  const basicRows = [
    ['نام کتاب', book.title],
    ['نویسنده', book.author],
    ['مترجم', book.translator],
    ['انتشارات', book.publisher],
    ['دسته‌بندی', book.category],
    ['وضعیت', getBookStatusLabel(book.status)],
    ['اولویت', getBookPriorityLabel(book.priority)],
    ['تعداد صفحات', book.totalPages > 0 ? formatNumber(book.totalPages) : ''],
  ]
  const purchaseRows = [
    ['قیمت تقریبی', formatPrice(book.expectedPrice)],
    ['قیمت خرید', formatPrice(book.price)],
    ['فروشگاه', book.purchaseStore],
    ['تاریخ خرید', formatDate(book.purchaseDate)],
  ]
  const readingRows = [
    ['تاریخ شروع مطالعه', formatDate(book.readingStartDate)],
    ['تاریخ پایان مطالعه', formatDate(book.readingEndDate)],
    ['صفحه فعلی', book.currentPage > 0 ? formatNumber(book.currentPage) : ''],
    ['پیشرفت مطالعه', book.totalPages > 0 ? `${formatNumber(progress)}٪` : ''],
    ['آخرین به‌روزرسانی پیشرفت', formatDateTime(book.lastProgressUpdate)],
  ]
  const metadataRows = [
    ['تاریخ ایجاد', formatDateTime(book.createdAt)],
    ['آخرین تغییر', formatDateTime(book.updatedAt)],
  ]

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

  function requestDelete() {
    if (preferences.confirmBeforeDelete) {
      setIsDeleteOpen(true)
      return
    }

    handleDeleteConfirm()
  }

  function handlePurchaseConfirm(purchaseValues) {
    const result = updateBook(book.id, createPurchaseConversionPayload(purchaseValues))

    if (result.success) {
      setFeedback('کتاب با موفقیت به کتابخانه اضافه شد.')
      setIsPurchaseOpen(false)
    }
  }

  function handleNotesSave(notes) {
    const result = updateBook(book.id, { notes })

    if (result.success) {
      setFeedback('یادداشت‌های کتاب ذخیره شد.')
    }
  }

  function handleReviewSave(personalReview) {
    const result = updateBook(book.id, { personalReview })

    if (result.success) {
      setFeedback('نظر شخصی ذخیره شد.')
    }
  }

  function handleRatingChange(rating) {
    const result = updateBook(book.id, { rating })

    if (result.success) {
      setFeedback(rating > 0 ? 'امتیاز کتاب ذخیره شد.' : 'امتیاز کتاب حذف شد.')
    }
  }

  return (
    <section className="book-details-page" aria-labelledby="book-details-title">
      <div className="library-header">
        <div>
          <h2 id="book-details-title">{book.title}</h2>
          <p>جزئیات کتاب، وضعیت مطالعه، یادداشت‌ها، نظر شخصی و نقل‌قول‌ها را از اینجا مدیریت کن.</p>
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
          <button className="button button-danger-soft" type="button" onClick={requestDelete}>
            حذف
          </button>
        </div>
      </div>

      <FeedbackMessage message={feedback} onDismiss={dismissFeedback} />

      <div className="details-section book-details">
        <h3>اطلاعات اصلی</h3>
        <DetailsList rows={basicRows} />
      </div>

      {shouldShowProgress ? (
        <div className="details-section">
          <h3>پیشرفت مطالعه</h3>
          <ReadingProgressBar
            currentPage={book.currentPage}
            showDetails
            totalPages={book.totalPages}
          />
          {canUpdateProgress ? (
            <div className="status-actions">
              <button
                className="button button-primary"
                type="button"
                onClick={() => setIsProgressOpen(true)}
              >
                به‌روزرسانی پیشرفت
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {isWishlistBook ? (
        <div className="details-section">
          <h3>خرید کتاب</h3>
          <p className="muted-note">
            این کتاب هنوز در لیست خرید است. برای انتقال همان رکورد به کتابخانه، خرید را ثبت کن.
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

      <div className="details-two-column">
        <div className="details-section book-details">
          <h3>اطلاعات خرید</h3>
          <DetailsList rows={purchaseRows} />
        </div>
        <div className="details-section book-details">
          <h3>تاریخ‌ها و مطالعه</h3>
          <DetailsList rows={readingRows} />
        </div>
      </div>

      <BookNotesSection notes={book.notes} onSave={handleNotesSave} />

      {!isWishlistBook ? (
        <BookReviewSection
          personalReview={book.personalReview}
          rating={book.rating}
          onRatingChange={handleRatingChange}
          onReviewSave={handleReviewSave}
        />
      ) : null}

      <BookQuotesSection book={book} onFeedback={setFeedback} onUpdateBook={updateBook} />

      <div className="details-section book-details">
        <h3>فراداده</h3>
        <DetailsList rows={metadataRows} />
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

      <ProgressUpdateController
        book={book}
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        onFinished={setFeedback}
        onProgressSaved={setFeedback}
      />
    </section>
  )
}

export default BookDetailsPage
