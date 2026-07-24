import { useState } from 'react'
import {
  getCardStatusTransition,
  getStatusTransitions,
} from '../../constants/bookStatusTransitions'
import { useBooksContext } from '../../context/useBooksContext'
import { createStatusTransitionUpdates } from '../../utils/applyBookStatusTransition'
import ConfirmDialog from '../common/ConfirmDialog'

const actionFeedbackMessages = {
  'start-reading': 'مطالعه کتاب شروع شد.',
  'pause-reading': 'مطالعه کتاب موقتاً متوقف شد.',
  'resume-reading': 'مطالعه کتاب ادامه پیدا کرد.',
  'finish-reading': 'کتاب به‌عنوان تمام‌شده ثبت شد.',
  'abandon-book': 'کتاب به‌عنوان رهاشده ثبت شد.',
  'return-to-library': 'کتاب به کتابخانه بازگردانده شد.',
}

function BookStatusActions({ book, compact = false, onComplete }) {
  const { updateBook } = useBooksContext()
  const [pendingTransition, setPendingTransition] = useState(null)
  const transitions = compact
    ? [getCardStatusTransition(book.status)].filter(Boolean)
    : getStatusTransitions(book.status)

  if (transitions.length === 0) {
    return compact ? null : (
      <p className="muted-note">برای وضعیت فعلی این کتاب اقدام مستقیمی وجود ندارد.</p>
    )
  }

  function applyTransition(transition) {
    const updates = createStatusTransitionUpdates(book, transition)
    const result = updateBook(book.id, updates)

    if (result.success) {
      onComplete?.(actionFeedbackMessages[transition.action])
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
