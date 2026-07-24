import { useCallback, useState } from 'react'
import BookDetailsModal from '../components/books/BookDetailsModal'
import BookFormModal from '../components/books/BookFormModal'
import BookGrid from '../components/books/BookGrid'
import ConfirmDialog from '../components/common/ConfirmDialog'
import FeedbackMessage from '../components/common/FeedbackMessage'
import { useBooksContext } from '../context/useBooksContext'

function LibraryPage() {
  const { addBook, books, deleteBook, updateBook } = useBooksContext()
  const [formState, setFormState] = useState({ book: null, mode: null })
  const [detailsBook, setDetailsBook] = useState(null)
  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const isFormOpen = Boolean(formState.mode)

  const dismissFeedback = useCallback(() => setFeedback(''), [])

  function openCreateForm() {
    setFormState({ book: null, mode: 'create' })
  }

  function openEditForm(book) {
    setDetailsBook(null)
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
      setDetailsBook(null)
      setDeleteCandidate(null)
    }
  }

  return (
    <section className="library-page" aria-labelledby="library-title">
      <div className="library-header">
        <div>
          <h2 id="library-title">کتابخانه من</h2>
          <p>
            کتاب‌های ثبت‌شده را ببینید، کتاب تازه اضافه کنید و اطلاعات پایه هر
            کتاب را ویرایش کنید.
          </p>
        </div>
        <button className="button button-primary" type="button" onClick={openCreateForm}>
          افزودن کتاب
        </button>
      </div>

      <FeedbackMessage message={feedback} onDismiss={dismissFeedback} />

      {books.length === 0 ? (
        <div className="empty-state">
          <h3>هنوز کتابی در کتابخانه ثبت نشده است.</h3>
          <p>
            اولین کتابت را اضافه کن تا Bookloom کم‌کم به کتابخانه شخصی تو تبدیل
            شود.
          </p>
          <button className="button button-primary" type="button" onClick={openCreateForm}>
            افزودن اولین کتاب
          </button>
        </div>
      ) : (
        <BookGrid
          books={books}
          onDelete={setDeleteCandidate}
          onEdit={openEditForm}
          onView={setDetailsBook}
        />
      )}

      <BookFormModal
        book={formState.book}
        isOpen={isFormOpen}
        mode={formState.mode}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
      />

      <BookDetailsModal
        book={detailsBook}
        isOpen={Boolean(detailsBook)}
        onClose={() => setDetailsBook(null)}
        onEdit={openEditForm}
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

export default LibraryPage
