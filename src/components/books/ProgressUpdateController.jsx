import { useState } from 'react'
import { BOOK_STATUS_ACTION } from '../../constants/bookStatusTransitions'
import { useBooksContext } from '../../context/useBooksContext'
import { usePreferences } from '../../context/usePreferences'
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
  const { t } = usePreferences()
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
          ? t('books.totalPagesUpdated')
          : t('books.progressSaved'),
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
      onFinished?.(t('books.movedToFinished'))
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
        cancelLabel={t('books.completionCancel')}
        confirmLabel={t('books.completionConfirm')}
        isOpen={Boolean(completionCandidate)}
        message={t('books.completionMessage')}
        title={t('books.completionTitle')}
        onCancel={() => setCompletionCandidate(null)}
        onConfirm={handleFinishConfirm}
      />
    </>
  )
}

export default ProgressUpdateController
