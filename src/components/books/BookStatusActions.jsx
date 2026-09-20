import { useState } from 'react'
import {
  getLocalizedCardStatusTransition,
  getLocalizedStatusTransitions,
} from '../../constants/bookStatusTransitions'
import { useBooksContext } from '../../context/useBooksContext'
import { usePreferences } from '../../context/usePreferences'
import { createStatusTransitionUpdates } from '../../utils/applyBookStatusTransition'
import ConfirmDialog from '../common/ConfirmDialog'

function BookStatusActions({ book, compact = false, onComplete }) {
  const { updateBook } = useBooksContext()
  const { language, t } = usePreferences()
  const [pendingTransition, setPendingTransition] = useState(null)
  const transitions = compact
    ? [getLocalizedCardStatusTransition(book.status, language.value)].filter(Boolean)
    : getLocalizedStatusTransitions(book.status, language.value)

  if (transitions.length === 0) {
    return compact ? null : (
      <p className="muted-note">{t('books.noStatusActions')}</p>
    )
  }

  function applyTransition(transition) {
    const updates = createStatusTransitionUpdates(book, transition)
    const result = updateBook(book.id, updates)

    if (result.success) {
      onComplete?.(t(`statusAction.${transition.action}.feedback`))
    }
  }

  function handleAction(transition) {
    if (transition.requiresConfirmation) {
      setPendingTransition(transition)
      return
    }

    applyTransition(transition)
  }

  function handleConfirm() {
    if (!pendingTransition) {
      return
    }

    applyTransition(pendingTransition)
    setPendingTransition(null)
  }

  return (
    <>
      <div className={compact ? 'status-actions compact' : 'status-actions'}>
        {transitions.map((transition) => (
          <button
            className={
              transition.action === 'abandon-book'
                ? 'button button-danger-soft'
                : 'button button-secondary'
            }
            key={transition.action}
            type="button"
            onClick={() => handleAction(transition)}
          >
            {transition.label}
          </button>
        ))}
      </div>

      <ConfirmDialog
        confirmLabel={pendingTransition?.label ?? ''}
        isOpen={Boolean(pendingTransition)}
        message={pendingTransition?.confirmationMessage ?? ''}
        title={pendingTransition?.confirmationTitle ?? ''}
        onCancel={() => setPendingTransition(null)}
        onConfirm={handleConfirm}
      />
    </>
  )
}

export default BookStatusActions
