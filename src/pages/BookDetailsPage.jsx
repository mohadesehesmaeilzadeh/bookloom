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
  const { t } = usePreferences()
  const visibleRows = rows.filter(([, value]) => value !== '' && value !== null && value !== undefined)

  if (visibleRows.length === 0) {
    return <p className="muted-note">{t('common.noDisplayData')}</p>
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
  const progress = calculateReadingProgress(book.currentPage, book.totalPages)
  const basicRows = [
    [t('bookFields.title'), book.title],
    [t('bookFields.author'), book.author],
    [t('bookFields.translator'), book.translator],
    [t('bookFields.publisher'), book.publisher],
    [t('bookFields.category'), book.category],
    [t('bookFields.status'), getBookStatusLabel(book.status, language.value)],
    [t('bookFields.priority'), getBookPriorityLabel(book.priority, language.value)],
    [t('bookFields.totalPages'), book.totalPages > 0 ? formatNumber(book.totalPages) : ''],
  ]
  const purchaseRows = [
    [t('bookFields.expectedPrice'), formatPrice(book.expectedPrice)],
    [t('bookFields.price'), formatPrice(book.price)],
    [t('bookFields.purchaseStore'), book.purchaseStore],
    [t('bookFields.purchaseDate'), formatDate(book.purchaseDate)],
  ]
  const readingRows = [
    [t('details.readingStartDate'), formatDate(book.readingStartDate)],
    [t('details.readingEndDate'), formatDate(book.readingEndDate)],
    [t('bookFields.currentPage'), book.currentPage > 0 ? formatNumber(book.currentPage) : ''],
    [t('details.readingProgress'), book.totalPages > 0 ? t('common.percent', { value: formatNumber(progress) }) : ''],
    [t('details.progressUpdated'), formatDateTime(book.lastProgressUpdate)],
  ]
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
      <div className="library-header">
        <div>
          <h2 id="book-details-title">{book.title}</h2>
          <p>{t('details.description')}</p>
        </div>
        <div className="form-actions">
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
      </div>

      <FeedbackMessage message={feedback} onDismiss={dismissFeedback} />

      <div className="details-section book-details">
        <h3>{t('details.basicInfo')}</h3>
        <DetailsList rows={basicRows} />
      </div>

      {shouldShowProgress ? (
        <div className="details-section">
          <h3>{t('details.readingProgress')}</h3>
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
                {t('books.updateProgress')}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

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

      <div className="details-two-column">
        <div className="details-section book-details">
          <h3>{t('details.purchaseInfo')}</h3>
          <DetailsList rows={purchaseRows} />
        </div>
        <div className="details-section book-details">
          <h3>{t('details.datesAndReading')}</h3>
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
