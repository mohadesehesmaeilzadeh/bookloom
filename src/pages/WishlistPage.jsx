import { useCallback, useState } from 'react'
import BookFormModal from '../components/books/BookFormModal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import FeedbackMessage from '../components/common/FeedbackMessage'
import PurchaseBookModal from '../components/wishlist/PurchaseBookModal'
import WishlistBookGrid from '../components/wishlist/WishlistBookGrid'
import { bookPriorities } from '../constants/bookPriorities'
import { BOOK_STATUS } from '../constants/bookStatuses'
import { useBooksContext } from '../context/useBooksContext'
import { formatPrice } from '../utils/formatPrice'
import { getWishlistBooks } from '../utils/bookSelectors'
import { ALL_PRIORITIES, filterWishlistByPriority } from '../utils/wishlist/wishlistFilters'
import { createPurchaseConversionPayload } from '../utils/wishlist/purchaseConversion'
import {
  WISHLIST_SORT,
  sortWishlistBooks,
  wishlistSortOptions,
} from '../utils/wishlist/wishlistSorting'
import { getWishlistSummary } from '../utils/wishlist/wishlistSummary'

function formatCount(value) {
  return value.toLocaleString('fa-IR')
}

function WishlistPage() {
  const { addBook, books, deleteBook, updateBook } = useBooksContext()
  const [priorityFilter, setPriorityFilter] = useState(ALL_PRIORITIES)
  const [sortBy, setSortBy] = useState(WISHLIST_SORT.PRIORITY)
  const [formState, setFormState] = useState({ book: null, mode: null })
  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const [purchaseCandidate, setPurchaseCandidate] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const wishlistBooks = getWishlistBooks(books)
  const visibleWishlistBooks = sortWishlistBooks(
    filterWishlistByPriority(wishlistBooks, priorityFilter),
    sortBy,
  )
  const summary = getWishlistSummary(wishlistBooks)
  const isFiltered = priorityFilter !== ALL_PRIORITIES
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
      value: formatCount(summary.totalCount),
    },
    {
      label: 'مجموع قیمت تقریبی',
      value: formatPrice(summary.estimatedTotalPrice) || '۰ تومان',
    },
    {
      label: 'کتاب‌های با اولویت بالا',
      value: formatCount(summary.highPriorityCount),
    },
    {
      label: 'کتاب‌های ضروری',
      value: formatCount(summary.urgentPriorityCount),
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

      <div className="wishlist-controls">
        <label className="form-field">
          <span>فیلتر اولویت</span>
          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
          >
            <option value={ALL_PRIORITIES}>همه اولویت‌ها</option>
            {bookPriorities.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>مرتب‌سازی</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            {wishlistSortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {isFiltered ? (
          <button
            className="button button-ghost"
            type="button"
            onClick={() => setPriorityFilter(ALL_PRIORITIES)}
          >
            پاک کردن فیلتر
          </button>
        ) : null}
      </div>

      {wishlistBooks.length === 0 ? (
        <div className="empty-state">
          <h3>هنوز کتابی در لیست خریدت نیست.</h3>
          <p>کتاب‌هایی را که قصد خریدشان را داری اینجا ثبت کن.</p>
          <button className="button button-primary" type="button" onClick={openCreateForm}>
            افزودن اولین کتاب
          </button>
        </div>
      ) : visibleWishlistBooks.length === 0 ? (
        <div className="empty-state">
          <h3>کتابی با این اولویت پیدا نشد.</h3>
          <p>فیلتر اولویت را تغییر بده یا آن را پاک کن.</p>
          <button
            className="button button-primary"
            type="button"
            onClick={() => setPriorityFilter(ALL_PRIORITIES)}
          >
            پاک کردن فیلتر
          </button>
        </div>
      ) : (
        <WishlistBookGrid
          books={visibleWishlistBooks}
          onDelete={setDeleteCandidate}
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
