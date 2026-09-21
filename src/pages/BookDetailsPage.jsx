import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BookFormModal from '../components/books/BookFormModal'
import BookNotesSection from '../components/books/BookNotesSection'
import BookReviewSection from '../components/books/BookReviewSection'
import ProgressUpdateController from '../components/books/ProgressUpdateController'
import ReadingProgressBar from '../components/books/ReadingProgressBar'
import ReadingSessionsSection from '../components/books/ReadingSessionsSection'
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
import { formatNumber, formatPlainNumber } from '../utils/formatNumber'
import { formatPrice } from '../utils/formatPrice'
import { createPurchaseConversionPayload } from '../utils/wishlist/purchaseConversion'

function DetailsList({ rows }) {
  const visibleRows = rows.filter(([, value]) => value !== '' && value !== null && value !== undefined)

  if (visibleRows.length === 0) {
    return null
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

function BookCover({ book }) {
  const { t } = usePreferences()
  const [failed, setFailed] = useState(false)

  return (
    <div className="book-detail-cover">
      {book.coverUrl && !failed ? (
        <img
          alt={t('details.coverAlt', { title: book.title })}
          src={book.coverUrl}
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true" className="book-detail-cover-placeholder" />
      )}
    </div>
  )
}

function BookDetailsPage() {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const { deleteBook, getBookById, updateBook } = useBooksContext()
  const { language, preferences, t } = usePreferences()
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
        <h2 id="missing-book-title">{t('details.missingTitle')}</h2>
        <p>{t('details.missingDescription')}</p>
        <Link className="button button-primary" to={ROUTES.LIBRARY}>
          {t('details.backToLibrary')}
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
  const basicRows = [
    [t('bookFields.publisher'), book.publisher],
    [t('bookFields.publishYear'), book.publishYear > 0 ? formatPlainNumber(book.publishYear) : ''],
    [t('bookFields.isbn'), book.isbn],
    [t('bookFields.totalPages'), book.totalPages > 0 ? formatNumber(book.totalPages) : ''],
    [t('bookFields.category'), book.category],
    [t('bookFields.translator'), book.translator],
  ]
  const hasBasicInfo = basicRows.some(([, value]) => value !== '' && value !== null && value !== undefined)
  const purchaseRows = [
    [t('bookFields.expectedPrice'), formatPrice(book.expectedPrice)],
    [t('bookFields.price'), formatPrice(book.price)],
    [t('bookFields.purchaseStore'), book.purchaseStore],
    [t('bookFields.purchaseDate'), formatDate(book.purchaseDate)],
  ]
  const readingRows = [
    [t('details.readingStartDate'), formatDate(book.readingStartDate)],
    [t('details.readingEndDate'), formatDate(book.readingEndDate)],
    [t('details.progressUpdated'), formatDateTime(book.lastProgressUpdate)],
  ]
  const hasPurchaseInfo = purchaseRows.some(([, value]) => value !== '' && value !== null && value !== undefined)
  const hasReadingDates = readingRows.some(([, value]) => value !== '' && value !== null && value !== undefined)
  const metadataRows = [
    [t('details.createdAt'), formatDateTime(book.createdAt)],
    [t('details.updatedAt'), formatDateTime(book.updatedAt)],
  ]

  function handleEditSubmit(payload) {
    const result = updateBook(book.id, payload)

    if (result.success) {
      setFeedback(t('books.bookChangesSaved'))
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
      setFeedback(t('wishlist.purchased'))
      setIsPurchaseOpen(false)
    }
  }

  function handleNotesSave(notes) {
    const result = updateBook(book.id, { notes })

    if (result.success) {
      setFeedback(t('details.notesSaved'))
    }
  }

  function handleReviewSave(personalReview) {
    const result = updateBook(book.id, { personalReview })

    if (result.success) {
      setFeedback(t('details.reviewSaved'))
    }
  }

  function handleRatingChange(rating) {
    const result = updateBook(book.id, { rating })

    if (result.success) {
      setFeedback(rating > 0 ? t('details.ratingSaved') : t('details.ratingRemoved'))
    }
  }

  return (
    <section className="book-details-page" aria-labelledby="book-details-title">
      <header className="book-detail-header">
        <div className="book-detail-identity">
          <BookCover key={book.coverUrl} book={book} />
          <div className="book-detail-heading">
            <h2 id="book-details-title">{book.title}</h2>
            {book.author ? <p className="book-detail-author">{book.author}</p> : null}
            <div className="book-detail-summary">
              <span>{getBookStatusLabel(book.status, language.value)}</span>
              <span>{getBookPriorityLabel(book.priority, language.value)}</span>
              {book.rating > 0 ? (
                <span>{t('rating.value', { value: formatNumber(book.rating), total: formatNumber(5) })}</span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="form-actions book-detail-actions">
          <Link className="button button-secondary" to={ROUTES.LIBRARY}>
            {t('details.backToLibrary')}
          </Link>
          <button className="button button-primary" type="button" onClick={() => setIsEditOpen(true)}>
            {t('books.editBook')}
          </button>
          {isWishlistBook ? (
            <button
              className="button button-primary"
              type="button"
              onClick={() => setIsPurchaseOpen(true)}
            >
              {t('wishlist.purchasedButton')}
            </button>
          ) : null}
          <button className="button button-danger-soft" type="button" onClick={requestDelete}>
            {t('common.delete')}
          </button>
        </div>
      </header>

      <FeedbackMessage message={feedback} onDismiss={dismissFeedback} />

      {hasBasicInfo ? (
        <div className="details-section book-details">
          <h3>{t('details.basicInfo')}</h3>
          <DetailsList rows={basicRows} />
        </div>
      ) : null}

      {!isWishlistBook ? (
        <div className="details-section">
          <h3>{t('details.readingProgress')}</h3>
          {shouldShowProgress && (book.totalPages > 0 || book.currentPage > 0) ? (
            <ReadingProgressBar
              currentPage={book.currentPage}
              showDetails
              totalPages={book.totalPages}
            />
          ) : (
            <p className="soft-empty-state">{t('details.progressEmpty')}</p>
          )}
          {canUpdateProgress ? (
            <div className="status-actions">
              <button
                className="button button-primary"
                type="button"
                onClick={() => setIsProgressOpen(true)}
              >
                {t('books.updateProgress')}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      <ReadingSessionsSection book={book} onFeedback={setFeedback} />

      {isWishlistBook ? (
        <div className="details-section">
          <h3>{t('details.purchaseBook')}</h3>
          <p className="muted-note">
            {t('details.purchaseDescription')}
          </p>
          <div className="status-actions">
            <button
              className="button button-primary"
              type="button"
              onClick={() => setIsPurchaseOpen(true)}
            >
              {t('wishlist.purchasedButton')}
            </button>
          </div>
        </div>
      ) : (
        <div className="details-section">
          <h3>{t('details.readingStatus')}</h3>
          <BookStatusActions book={book} onComplete={setFeedback} />
        </div>
      )}

      {hasPurchaseInfo || hasReadingDates ? (
        <div className="details-two-column">
          {hasPurchaseInfo ? (
            <div className="details-section book-details">
              <h3>{t('details.purchaseInfo')}</h3>
              <DetailsList rows={purchaseRows} />
            </div>
          ) : null}
          {hasReadingDates ? (
            <div className="details-section book-details">
              <h3>{t('details.datesAndReading')}</h3>
              <DetailsList rows={readingRows} />
            </div>
          ) : null}
        </div>
      ) : null}

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
        <h3>{t('details.metadata')}</h3>
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
        confirmLabel={t('books.deleteBook')}
        isConfirming={isDeleting}
        isOpen={isDeleteOpen}
        message={t('books.deleteBookMessage', { title: book.title })}
        title={t('books.deleteBook')}
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
