import { useCallback, useState } from 'react'
import BookFormModal from './BookFormModal'
import BookGrid from './BookGrid'
import ProgressUpdateController from './ProgressUpdateController'
import ConfirmDialog from '../common/ConfirmDialog'
import FeedbackMessage from '../common/FeedbackMessage'
import { useBooksContext } from '../../context/useBooksContext'

function BookCollectionView({
  addButtonLabel = 'افزودن کتاب',
  allowCreate = false,
  books,
  description,
  emptyActionLabel,
  emptyDescription,
  emptyTitle,
  showProgressDetails = false,
  title,
}) {
  const { addBook, deleteBook, updateBook } = useBooksContext()
  const [formState, setFormState] = useState({ book: null, mode: null })
  const [progressBook, setProgressBook] = useState(null)
  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [feedback, setFeedback] = useState('')
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
    if (formState.mode === 'edit' && formState.book) {
      const result = updateBook(formState.book.id, payload)

      if (result.success) {
        setFeedback('تغییرات کتاب ذخیره شد.')
      }
    } else {
      addBook(payload)
      setFeedback('کتاب با موفقیت اضافه شد.')
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

  return (
    <section className="library-page" aria-labelledby="collection-title">
      <div className="library-header">
        <div>
          <h2 id="collection-title">{title}</h2>
          <p>{description}</p>
        </div>
        {allowCreate ? (
          <button className="button button-primary" type="button" onClick={openCreateForm}>
            {addButtonLabel}
          </button>
        ) : null}
      </div>

      <FeedbackMessage message={feedback} onDismiss={dismissFeedback} />

      {books.length === 0 ? (
        <div className="empty-state">
          <h3>{emptyTitle}</h3>
          <p>{emptyDescription}</p>
          {allowCreate ? (
            <button className="button button-primary" type="button" onClick={openCreateForm}>
              {emptyActionLabel ?? addButtonLabel}
            </button>
          ) : null}
        </div>
      ) : (
        <BookGrid
          books={books}
          onDelete={setDeleteCandidate}
          onEdit={openEditForm}
          onProgressUpdate={setProgressBook}
          showProgressDetails={showProgressDetails}
          onStatusChange={setFeedback}
        />
      )}

      <BookFormModal
        book={formState.book}
        isOpen={isFormOpen}
        mode={formState.mode}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
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

      <ProgressUpdateController
        book={progressBook}
        isOpen={Boolean(progressBook)}
        onClose={() => setProgressBook(null)}
        onFinished={setFeedback}
        onProgressSaved={setFeedback}
      />
    </section>
  )
}

export default BookCollectionView
