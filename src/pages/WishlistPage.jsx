import { useCallback, useState } from 'react'
import BookFormModal from '../components/books/BookFormModal'
import BookCollectionToolbar from '../components/books/BookCollectionToolbar'
import ConfirmDialog from '../components/common/ConfirmDialog'
import FeedbackMessage from '../components/common/FeedbackMessage'
import PurchaseBookModal from '../components/wishlist/PurchaseBookModal'
import WishlistBookGrid from '../components/wishlist/WishlistBookGrid'
import WishlistBookList from '../components/wishlist/WishlistBookList'
import { BOOK_STATUS } from '../constants/bookStatuses'
import { VIEW_MODE } from '../constants/viewModes'
import { useBookCollectionControls } from '../hooks/useBookCollectionControls'
import { useBooksContext } from '../context/useBooksContext'
import { usePreferences } from '../context/usePreferences'
import { formatNumber } from '../utils/formatNumber'
import { formatPrice } from '../utils/formatPrice'
import { getWishlistBooks } from '../utils/bookSelectors'
import { createPurchaseConversionPayload } from '../utils/wishlist/purchaseConversion'
import {
  WISHLIST_SORT,
  getWishlistSortOptions,
  sortWishlistBooks,
} from '../utils/wishlist/wishlistSorting'
import { getWishlistSummary } from '../utils/wishlist/wishlistSummary'

function WishlistPage() {
  const { addBook, books, deleteBook, updateBook } = useBooksContext()
  const { language, preferences, t } = usePreferences()
  const [formState, setFormState] = useState({ book: null, mode: null })
  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const [purchaseCandidate, setPurchaseCandidate] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const wishlistBooks = getWishlistBooks(books)
  const controls = useBookCollectionControls({
    books: wishlistBooks,
    initialSort: WISHLIST_SORT.PRIORITY,
    storageNamespace: 'wishlist',
    customSort: sortWishlistBooks,
  })
  const summary = getWishlistSummary(wishlistBooks)
  const isFormOpen = Boolean(formState.mode)

  const dismissFeedback = useCallback(() => setFeedback(''), [])

  function openCreateForm() {
    setFormState({ book: null, mode: 'create' })
  }

  function openEditForm(book) {
    setFormState({ book, mode: 'edit' })
  }

  function closeForm() {
    setFormState({ book: null, mode: null })
  }

  function handleFormSubmit(payload) {
    const wishlistPayload = {
      ...payload,
      status: BOOK_STATUS.WISHLIST,
    }

    if (formState.mode === 'edit' && formState.book) {
      const result = updateBook(formState.book.id, wishlistPayload)

      if (result.success) {
        setFeedback(t('wishlist.changesSaved'))
      }
    } else {
      addBook(wishlistPayload)
      setFeedback(t('wishlist.added'))
    }

    closeForm()
  }

  function handleConfirmDelete() {
    if (!deleteCandidate) {
      return
    }

    setIsDeleting(true)
    const result = deleteBook(deleteCandidate.id)
    setIsDeleting(false)

    if (result.success) {
      setFeedback(t('books.bookDeleted'))
      setDeleteCandidate(null)
    }
  }

  function requestDelete(book) {
    if (preferences.confirmBeforeDelete) {
      setDeleteCandidate(book)
      return
    }

    const result = deleteBook(book.id)

    if (result.success) {
      setFeedback(t('books.bookDeleted'))
    }
  }

  function handlePurchaseConfirm(purchaseValues) {
    if (!purchaseCandidate) {
      return
    }

    const result = updateBook(
      purchaseCandidate.id,
      createPurchaseConversionPayload(purchaseValues),
    )

    if (result.success) {
      setFeedback(t('wishlist.purchased'))
      setPurchaseCandidate(null)
    }
  }

  const summaryCards = [
    {
      label: t('wishlist.summary.count'),
      value: formatNumber(summary.totalCount),
    },
    {
      label: t('wishlist.summary.price'),
      value: formatPrice(summary.estimatedTotalPrice) || t('wishlist.zeroPrice'),
    },
    {
      label: t('wishlist.summary.high'),
      value: formatNumber(summary.highPriorityCount),
    },
    {
      label: t('wishlist.summary.urgent'),
      value: formatNumber(summary.urgentPriorityCount),
    },
  ]

  return (
    <section className="library-page wishlist-page" aria-labelledby="wishlist-title">
      <div className="library-header">
        <div>
          <h2 id="wishlist-title">{t('wishlist.title')}</h2>
          <p>{t('wishlist.description')}</p>
        </div>
        <button className="button button-primary" type="button" onClick={openCreateForm}>
          {t('books.addToWishlist')}
        </button>
      </div>

      <FeedbackMessage message={feedback} onDismiss={dismissFeedback} />

      <div className="wishlist-summary" aria-label={t('wishlist.summaryAria')}>
        {summaryCards.map((card) => (
          <article className="summary-card wishlist-summary-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      {wishlistBooks.length > 0 ? (
        <BookCollectionToolbar
          books={wishlistBooks}
          controls={controls}
          enabledFilters={['category', 'priority']}
          sortOptions={getWishlistSortOptions(language.value)}
        />
      ) : null}

      {wishlistBooks.length === 0 ? (
        <div className="empty-state">
          <h3>{t('wishlist.emptyTitle')}</h3>
          <p>{t('wishlist.emptyDescription')}</p>
          <button className="button button-primary" type="button" onClick={openCreateForm}>
            {t('wishlist.addFirst')}
          </button>
        </div>
      ) : controls.visibleBooks.length === 0 ? (
        <div className="empty-state">
          <h3>{t('wishlist.noResultsTitle')}</h3>
          <p>{t('wishlist.noResultsDescription')}</p>
          <button
            className="button button-primary"
            type="button"
            onClick={controls.clearControls}
          >
            {t('common.clearFilters')}
          </button>
        </div>
      ) : controls.viewMode === VIEW_MODE.LIST ? (
        <WishlistBookList
          books={controls.visibleBooks}
          onDelete={requestDelete}
          onEdit={openEditForm}
          onPurchase={setPurchaseCandidate}
        />
      ) : (
        <WishlistBookGrid
          books={controls.visibleBooks}
          onDelete={requestDelete}
          onEdit={openEditForm}
          onPurchase={setPurchaseCandidate}
        />
      )}

      <BookFormModal
        book={formState.book}
        isOpen={isFormOpen}
        mode={formState.mode}
        variant="wishlist"
        onClose={closeForm}
        onSubmit={handleFormSubmit}
      />

      <PurchaseBookModal
        book={purchaseCandidate}
        isOpen={Boolean(purchaseCandidate)}
        onClose={() => setPurchaseCandidate(null)}
        onConfirm={handlePurchaseConfirm}
      />

      <ConfirmDialog
        confirmLabel={t('books.deleteBook')}
        isConfirming={isDeleting}
        isOpen={Boolean(deleteCandidate)}
        message={
          deleteCandidate
            ? t('books.deleteBookMessage', { title: deleteCandidate.title })
            : ''
        }
        title={t('books.deleteBook')}
        onCancel={() => setDeleteCandidate(null)}
        onConfirm={handleConfirmDelete}
      />
    </section>
  )
}

export default WishlistPage
