import Modal from '../common/Modal'
import BookForm from './BookForm'

function BookFormModal({ book, isOpen, mode, onClose, onSubmit, variant = 'default' }) {
  const isEditing = mode === 'edit'
  const isWishlistVariant = variant === 'wishlist'

  return (
    <Modal
      isOpen={isOpen}
      title={
        isEditing
          ? 'ویرایش کتاب'
          : isWishlistVariant
            ? 'افزودن به لیست خرید'
            : 'افزودن کتاب'
      }
      onClose={onClose}
    >
      <BookForm
        book={isEditing ? book : null}
        submitLabel={
          isEditing
            ? 'ذخیره تغییرات'
            : isWishlistVariant
              ? 'افزودن به لیست خرید'
              : 'افزودن کتاب'
        }
        variant={variant}
        onCancel={onClose}
        onSubmit={onSubmit}
      />
    </Modal>
  )
}

export default BookFormModal
