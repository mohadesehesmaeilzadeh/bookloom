import Modal from '../common/Modal'
import BookForm from './BookForm'

function BookFormModal({ book, isOpen, mode, onClose, onSubmit }) {
  const isEditing = mode === 'edit'

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? 'ویرایش کتاب' : 'افزودن کتاب'}
      onClose={onClose}
    >
      <BookForm
        book={isEditing ? book : null}
        submitLabel={isEditing ? 'ذخیره تغییرات' : 'افزودن کتاب'}
        onCancel={onClose}
        onSubmit={onSubmit}
      />
    </Modal>
  )
}

export default BookFormModal
