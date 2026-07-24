import { Link } from 'react-router-dom'
import BookCollectionView from '../components/books/BookCollectionView'
import { BOOK_SORT } from '../constants/bookSortOptions'
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
      enabledFilters={['category']}
      initialSort={BOOK_SORT.RECENTLY_UPDATED}
      sortOptions={[
        { value: BOOK_SORT.RECENTLY_UPDATED, label: 'آخرین به‌روزرسانی' },
        { value: BOOK_SORT.HIGHEST_PROGRESS, label: 'بیشترین پیشرفت' },
        { value: BOOK_SORT.TITLE, label: 'نام کتاب' },
        { value: BOOK_SORT.AUTHOR, label: 'نام نویسنده' },
        { value: BOOK_SORT.READING_STARTED_NEWEST, label: 'جدیدترین شروع مطالعه' },
      ]}
      showProgressDetails
      storageNamespace="reading"
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
