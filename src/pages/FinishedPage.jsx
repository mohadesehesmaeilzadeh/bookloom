import { Link } from 'react-router-dom'
import BookCollectionView from '../components/books/BookCollectionView'
import { ROUTES } from '../constants/routes'
import { useBooksContext } from '../context/useBooksContext'
import { getFinishedBooks } from '../utils/bookSelectors'

function FinishedPage() {
  const { books } = useBooksContext()

  return (
    <BookCollectionView
      books={getFinishedBooks(books)}
      description="کتاب‌هایی که مطالعه آن‌ها به پایان رسیده است."
      emptyDescription={
        <>
          از{' '}
          <Link className="inline-link" to={ROUTES.LIBRARY}>
            کتابخانه
          </Link>
          ، کتابی را شروع کن و پس از پایان مطالعه اینجا ثبتش کن.
        </>
      }
      emptyTitle="هنوز کتابی را به‌عنوان تمام‌شده ثبت نکرده‌ای."
      title="کتاب‌های تمام‌شده"
    />
  )
}

export default FinishedPage
