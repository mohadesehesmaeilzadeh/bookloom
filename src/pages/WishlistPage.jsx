import BookCollectionView from '../components/books/BookCollectionView'
import { useBooksContext } from '../context/useBooksContext'
import { getWishlistBooks } from '../utils/bookSelectors'

function WishlistPage() {
  const { books } = useBooksContext()

  return (
    <BookCollectionView
      books={getWishlistBooks(books)}
      description="کتاب‌هایی که هنوز تهیه نشده‌اند و در لیست خرید مانده‌اند."
      emptyDescription="وقتی کتابی را با وضعیت لیست خرید ثبت کنی، اینجا دیده می‌شود."
      emptyTitle="هنوز کتابی به لیست خرید اضافه نشده است."
      title="لیست خرید"
    />
  )
}

export default WishlistPage
