import { Link } from 'react-router-dom'
import BookCollectionView from '../components/books/BookCollectionView'
import { ROUTES } from '../constants/routes'
import { useBooksContext } from '../context/useBooksContext'
import { getReadingBooks } from '../utils/bookSelectors'
import { sortReadingBooksByActivity } from '../utils/readingProgress'

function ReadingPage() {
  const { books } = useBooksContext()

  return (
    <BookCollectionView
      books={sortReadingBooksByActivity(getReadingBooks(books))}
      description="کتاب‌هایی که اکنون در حال مطالعه هستند یا موقتاً متوقف شده‌اند."
      showProgressDetails
      emptyDescription={
        <>
          از{' '}
          <Link className="inline-link" to={ROUTES.LIBRARY}>
            کتابخانه
          </Link>
          ، یکی از کتاب‌ها را برای شروع انتخاب کن.
        </>
      }
      emptyTitle="در حال حاضر کتابی برای ادامه مطالعه نداری."
      title="در حال مطالعه"
    />
  )
}

export default ReadingPage
