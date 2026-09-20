import Modal from '../common/Modal'
import { usePreferences } from '../../context/usePreferences'
import BookForm from './BookForm'

function BookFormModal({ book, isOpen, mode, onClose, onSubmit, variant = 'default' }) {
  const { t } = usePreferences()
  const isEditing = mode === 'edit'
  const isWishlistVariant = variant === 'wishlist'

  return (
    <Modal
      isOpen={isOpen}
      title={
        isEditing
          ? t('books.editBook')
          : isWishlistVariant
            ? t('books.addToWishlist')
            : t('books.addBook')
      }
      onClose={onClose}
    >
      <BookForm
        book={isEditing ? book : null}
        submitLabel={
          isEditing
            ? t('common.saveChanges')
            : isWishlistVariant
              ? t('books.addToWishlist')
              : t('books.addBook')
        }
        variant={variant}
        onCancel={onClose}
        onSubmit={onSubmit}
      />
    </Modal>
  )
}

export default BookFormModal
