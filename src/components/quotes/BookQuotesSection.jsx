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
  const { preferences, t } = usePreferences()
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
      onFeedback(t('quotes.added'))
      closeForm()
    }
  }

  function handleEdit(values) {
    const selectedQuote = formState.quote

    if (!selectedQuote) {
      return
    }

    if (!book.quotes.some((quote) => quote.id === selectedQuote.id)) {
      onFeedback(t('quotes.notFound'))
      closeForm()
      return
    }

    const result = onUpdateBook(book.id, {
      quotes: book.quotes.map((quote) =>
        quote.id === selectedQuote.id ? updateQuotePayload(quote, values) : quote,
      ),
    })

    if (result.success) {
      onFeedback(t('quotes.changesSaved'))
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
      onFeedback(t('quotes.deleted'))
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
      onFeedback(t('quotes.deleted'))
    }
  }

  return (
    <section className="details-section quotes-section" aria-labelledby="book-quotes-title">
      <div className="dashboard-item-header">
        <div>
          <h3 id="book-quotes-title">{t('quotes.title')}</h3>
          <p>{t('quotes.savedCount', { count: formatNumber(quotes.length) })}</p>
        </div>
        <button
          className="button button-primary"
          type="button"
          onClick={() => setFormState({ mode: 'create', quote: null })}
        >
          {t('quotes.add')}
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
          {t('quotes.empty')}
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
        confirmLabel={t('quotes.delete')}
        isOpen={Boolean(deleteCandidate)}
        message={t('quotes.deleteMessage')}
        title={t('quotes.delete')}
        onCancel={() => setDeleteCandidate(null)}
        onConfirm={handleDelete}
      />
    </section>
  )
}

export default BookQuotesSection
