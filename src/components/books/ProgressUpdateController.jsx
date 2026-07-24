import { useState } from 'react'
import { BOOK_STATUS_ACTION } from '../../constants/bookStatusTransitions'
import { useBooksContext } from '../../context/useBooksContext'
import { createStatusTransitionUpdates } from '../../utils/applyBookStatusTransition'
import { isBookProgressComplete } from '../../utils/readingProgress'
import ConfirmDialog from '../common/ConfirmDialog'
import UpdateProgressModal from './UpdateProgressModal'

function ProgressUpdateController({
  book,
  isOpen,
  onClose,
  onFinished,
  onProgressSaved,
}) {
  const { updateBook } = useBooksContext()
  const [completionCandidate, setCompletionCandidate] = useState(null)

  function handleProgressSubmit(progressValues) {
    const updatedProgress = {
      ...progressValues,
      lastProgressUpdate: new Date().toISOString(),
    }
    const result = updateBook(book.id, updatedProgress)

    if (result.success) {
      onProgressSaved?.(
        progressValues.totalPages !== book.totalPages
          ? 'تعداد صفحات کتاب به‌روزرسانی شد.'
          : 'پیشرفت مطالعه ذخیره شد.',
      )
      onClose()

      const completedBook = {
        ...book,
        ...updatedProgress,
      }

      if (isBookProgressComplete(completedBook) && book.status !== 'finished') {
        setCompletionCandidate(completedBook)
      }
    }
  }

  function handleFinishConfirm() {
    if (!completionCandidate) {
      return
    }

    const updates = createStatusTransitionUpdates(completionCandidate, {
      action: BOOK_STATUS_ACTION.FINISH_READING,
      targetStatus: 'finished',
    })
    const result = updateBook(completionCandidate.id, updates)

    if (result.success) {
      onFinished?.('کتاب به فهرست تمام‌شده‌ها منتقل شد.')
      setCompletionCandidate(null)
    }
  }

  return (
    <>
      <UpdateProgressModal
        book={book}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleProgressSubmit}
      />

      <ConfirmDialog
        cancelLabel="فعلاً نه"
        confirmLabel="بله، تمام شد"
        isOpen={Boolean(completionCandidate)}
        message="به آخرین صفحه این کتاب رسیدی. آیا می‌خواهی کتاب را تمام‌شده علامت بزنی؟"
        title="پایان مطالعه"
        onCancel={() => setCompletionCandidate(null)}
        onConfirm={handleFinishConfirm}
      />
    </>
  )
}

export default ProgressUpdateController
