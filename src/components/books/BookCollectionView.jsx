import { useCallback, useState } from 'react'
import { BOOK_SORT, bookSortOptions, localizeBookSortOptions } from '../../constants/bookSortOptions'
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
import { usePreferences } from '../../context/usePreferences'

function BookCollectionView({
  addButtonLabel,
  allowCreate = false,
  books,
  description,
  emptyActionLabel,
  emptyDescription,
  emptyTitle,
  enabledFilters = [],
  initialSort = BOOK_SORT.NEWEST,
  noResultsDescription,
  noResultsTitle,
  renderHeaderActions,
  showProgressDetails = false,
  sortOptions = bookSortOptions,
  storageNamespace = 'library',
  title,
}) {
  const { addBook, deleteBook, updateBook } = useBooksContext()
  const { language, preferences, t } = usePreferences()
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
  const localizedAddButtonLabel = addButtonLabel ?? t('books.addBook')
  const localizedNoResultsDescription =
    noResultsDescription ?? t('collection.noResultsDescription')
  const localizedNoResultsTitle = noResultsTitle ?? t('collection.noResultsTitle')
  const localizedSortOptions = localizeBookSortOptions(sortOptions, language.value)

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
        setFeedback(t('books.bookChangesSaved'))
      }
    } else {
      addBook(payload)
      setFeedback(t('books.bookAdded'))
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
      setFeedback(t('books.bookDeleted'))
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
      setFeedback(t('books.bookDeleted'))
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
              {localizedAddButtonLabel}
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
          sortOptions={localizedSortOptions}
        />
      ) : null}

      {books.length === 0 ? (
        <div className="empty-state">
          <h3>{emptyTitle}</h3>
          <p>{emptyDescription}</p>
          {allowCreate ? (
            <button className="button button-primary" type="button" onClick={openCreateForm}>
              {emptyActionLabel ?? localizedAddButtonLabel}
            </button>
          ) : null}
        </div>
      ) : controls.visibleBooks.length === 0 ? (
        <div className="empty-state">
          <h3>{localizedNoResultsTitle}</h3>
          <p>{localizedNoResultsDescription}</p>
          <button
            className="button button-primary"
            type="button"
            onClick={controls.clearControls}
          >
            {t('common.clearFilters')}
          </button>
        </div>
      ) : controls.viewMode === VIEW_MODE.LIST ? (
        <BookList
          books={controls.visibleBooks}
          onDelete={requestDelete}
          onEdit={openEditForm}
          onProgressUpdate={setProgressBook}
          showProgressDetails={showProgressDetails}
          onStatusChange={setFeedback}
        />
      ) : (
        <BookGrid
          books={controls.visibleBooks}
          onDelete={requestDelete}
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
        confirmLabel={t('books.deleteBook')}
        isConfirming={isDeleting}
        isOpen={Boolean(deleteCandidate)}
        message={
          deleteCandidate
            ? t('books.deleteBookMessage', { title: deleteCandidate.title })
            : ''
        }
        title={t('books.deleteBook')}
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
