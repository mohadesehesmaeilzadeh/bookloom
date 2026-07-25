import { useState } from 'react'
import ConfirmDialog from '../common/ConfirmDialog'
import { usePreferences } from '../../context/usePreferences'
import { formatNumber } from '../../utils/formatNumber'
import { sortQuotesByCreatedAt } from '../../utils/bookQuotes'
import {
  createQuotePayload,
  updateQuotePayload,
} from '../../utils/quoteValidation'
import QuoteCard from './QuoteCard'
import QuoteFormModal from './QuoteFormModal'

function BookQuotesSection({ book, onFeedback, onUpdateBook }) {
  const { preferences } = usePreferences()
  const [formState, setFormState] = useState({ mode: null, quote: null })
  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const quotes = sortQuotesByCreatedAt(book.quotes ?? [])
  const isFormOpen = Boolean(formState.mode)

  function closeForm() {
    setFormState({ mode: null, quote: null })
  }

  function handleCreate(values) {
    const nextQuote = createQuotePayload(values)
    const result = onUpdateBook(book.id, {
      quotes: [...book.quotes, nextQuote],
    })

    if (result.success) {
      onFeedback('نقل‌قول با موفقیت اضافه شد.')
      closeForm()
    }
  }

  function handleEdit(values) {
    const selectedQuote = formState.quote

    if (!selectedQuote) {
      return
    }

    if (!book.quotes.some((quote) => quote.id === selectedQuote.id)) {
      onFeedback('نقل‌قول موردنظر پیدا نشد.')
      closeForm()
      return
    }

    const result = onUpdateBook(book.id, {
      quotes: book.quotes.map((quote) =>
        quote.id === selectedQuote.id ? updateQuotePayload(quote, values) : quote,
      ),
    })

    if (result.success) {
      onFeedback('تغییرات نقل‌قول ذخیره شد.')
      closeForm()
    }
  }

  function handleDelete() {
    if (!deleteCandidate) {
      return
    }

    const result = onUpdateBook(book.id, {
      quotes: book.quotes.filter((quote) => quote.id !== deleteCandidate.id),
    })

    if (result.success) {
      onFeedback('نقل‌قول حذف شد.')
      setDeleteCandidate(null)
    }
  }

  function requestDelete(quote) {
    if (preferences.confirmBeforeDelete) {
      setDeleteCandidate(quote)
      return
    }

    const result = onUpdateBook(book.id, {
      quotes: book.quotes.filter((bookQuote) => bookQuote.id !== quote.id),
    })

    if (result.success) {
      onFeedback('نقل‌قول حذف شد.')
    }
  }

  return (
    <section className="details-section quotes-section" aria-labelledby="book-quotes-title">
      <div className="dashboard-item-header">
        <div>
          <h3 id="book-quotes-title">نقل‌قول‌های کتاب</h3>
          <p>{formatNumber(quotes.length)} نقل‌قول ذخیره شده</p>
        </div>
        <button
          className="button button-primary"
          type="button"
          onClick={() => setFormState({ mode: 'create', quote: null })}
        >
          افزودن نقل‌قول
        </button>
      </div>

      {quotes.length > 0 ? (
        <ul className="quote-list">
          {quotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              onDelete={requestDelete}
              onEdit={(selectedQuote) => setFormState({ mode: 'edit', quote: selectedQuote })}
            />
          ))}
        </ul>
      ) : (
        <div className="soft-empty-state">
          هنوز نقل‌قولی برای این کتاب ثبت نشده است. جمله‌های مهم یا دوست‌داشتنی کتاب را اینجا نگه دار.
        </div>
      )}

      <QuoteFormModal
        isOpen={isFormOpen}
        mode={formState.mode}
        quote={formState.quote}
        onClose={closeForm}
        onSubmit={formState.mode === 'edit' ? handleEdit : handleCreate}
      />

      <ConfirmDialog
        confirmLabel="حذف نقل‌قول"
        isOpen={Boolean(deleteCandidate)}
        message="آیا از حذف این نقل‌قول مطمئن هستید؟ این کار قابل بازگشت نیست."
        title="حذف نقل‌قول"
        onCancel={() => setDeleteCandidate(null)}
        onConfirm={handleDelete}
      />
    </section>
  )
}

export default BookQuotesSection
