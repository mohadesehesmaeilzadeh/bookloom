import { useCallback, useState } from 'react'
import { BOOK_SORT, bookSortOptions } from '../../constants/bookSortOptions'
import { VIEW_MODE } from '../../constants/viewModes'
import { useBookCollectionControls } from '../../hooks/useBookCollectionControls'
import BookFormModal from './BookFormModal'
import BookGrid from './BookGrid'
import BookList from './BookList'
import BookCollectionToolbar from './BookCollectionToolbar'
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
  enabledFilters = [],
  initialSort = BOOK_SORT.NEWEST,
  noResultsDescription = 'جست‌وجو یا فیلترها را تغییر بده.',
  noResultsTitle = 'کتابی با این جست‌وجو یا فیلترها پیدا نشد.',
  renderHeaderActions,
  showProgressDetails = false,
  sortOptions = bookSortOptions,
  storageNamespace = 'library',
  title,
}) {
  const { addBook, deleteBook, updateBook } = useBooksContext()
  const [formState, setFormState] = useState({ book: null, mode: null })
  const [progressBook, setProgressBook] = useState(null)
  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const controls = useBookCollectionControls({
    books,
    initialSort,
    storageNamespace,
  })
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
        <div className="form-actions">
          {renderHeaderActions?.({ setFeedback })}
          {allowCreate ? (
            <button className="button button-primary" type="button" onClick={openCreateForm}>
              {addButtonLabel}
            </button>
          ) : null}
        </div>
      </div>

      <FeedbackMessage message={feedback} onDismiss={dismissFeedback} />

      {books.length > 0 ? (
        <BookCollectionToolbar
          books={books}
          controls={controls}
          enabledFilters={enabledFilters}
          sortOptions={sortOptions}
        />
      ) : null}

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
      ) : controls.visibleBooks.length === 0 ? (
        <div className="empty-state">
          <h3>{noResultsTitle}</h3>
          <p>{noResultsDescription}</p>
          <button
            className="button button-primary"
            type="button"
            onClick={controls.clearControls}
          >
            پاک کردن فیلترها
          </button>
        </div>
      ) : controls.viewMode === VIEW_MODE.LIST ? (
        <BookList
          books={controls.visibleBooks}
          onDelete={setDeleteCandidate}
          onEdit={openEditForm}
          onProgressUpdate={setProgressBook}
          showProgressDetails={showProgressDetails}
          onStatusChange={setFeedback}
        />
      ) : (
        <BookGrid
          books={controls.visibleBooks}
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
