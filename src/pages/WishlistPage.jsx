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
  sortWishlistBooks,
  wishlistSortOptions,
} from '../utils/wishlist/wishlistSorting'
import { getWishlistSummary } from '../utils/wishlist/wishlistSummary'

function WishlistPage() {
  const { addBook, books, deleteBook, updateBook } = useBooksContext()
  const { preferences } = usePreferences()
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
        setFeedback('تغییرات لیست خرید ذخیره شد.')
      }
    } else {
      addBook(wishlistPayload)
      setFeedback('کتاب به لیست خرید اضافه شد.')
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
      setFeedback('کتاب حذف شد.')
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
      setFeedback('کتاب حذف شد.')
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
      setFeedback('کتاب با موفقیت به کتابخانه اضافه شد.')
      setPurchaseCandidate(null)
    }
  }

  const summaryCards = [
    {
      label: 'تعداد کتاب‌های لیست خرید',
      value: formatNumber(summary.totalCount),
    },
    {
      label: 'مجموع قیمت تقریبی',
      value: formatPrice(summary.estimatedTotalPrice) || '۰ تومان',
    },
    {
      label: 'کتاب‌های با اولویت بالا',
      value: formatNumber(summary.highPriorityCount),
    },
    {
      label: 'کتاب‌های ضروری',
      value: formatNumber(summary.urgentPriorityCount),
    },
  ]

  return (
    <section className="library-page wishlist-page" aria-labelledby="wishlist-title">
      <div className="library-header">
        <div>
          <h2 id="wishlist-title">لیست خرید</h2>
          <p>
            کتاب‌هایی را که قصد خریدشان را داری اینجا ثبت کن، اولویت بده و بعد
            از خرید همان رکورد را به کتابخانه منتقل کن.
          </p>
        </div>
        <button className="button button-primary" type="button" onClick={openCreateForm}>
          افزودن به لیست خرید
        </button>
      </div>

      <FeedbackMessage message={feedback} onDismiss={dismissFeedback} />

      <div className="wishlist-summary" aria-label="خلاصه لیست خرید">
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
          sortOptions={wishlistSortOptions}
        />
      ) : null}

      {wishlistBooks.length === 0 ? (
        <div className="empty-state">
          <h3>هنوز کتابی در لیست خریدت نیست.</h3>
          <p>کتاب‌هایی را که قصد خریدشان را داری اینجا ثبت کن.</p>
          <button className="button button-primary" type="button" onClick={openCreateForm}>
            افزودن اولین کتاب
          </button>
        </div>
      ) : controls.visibleBooks.length === 0 ? (
        <div className="empty-state">
          <h3>کتابی با این جست‌وجو یا فیلترها پیدا نشد.</h3>
          <p>جست‌وجو یا فیلترها را تغییر بده.</p>
          <button
            className="button button-primary"
            type="button"
            onClick={controls.clearControls}
          >
            پاک کردن فیلترها
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
        confirmLabel="حذف کتاب"
        isConfirming={isDeleting}
        isOpen={Boolean(deleteCandidate)}
        message={
          deleteCandidate
            ? `آیا از حذف کتاب «${deleteCandidate.title}» مطمئن هستید؟ این کار قابل بازگشت نیست.`
            : ''
        }
        title="حذف کتاب"
        onCancel={() => setDeleteCandidate(null)}
        onConfirm={handleConfirmDelete}
      />
    </section>
  )
}

export default WishlistPage
