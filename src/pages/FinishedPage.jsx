import { Link } from 'react-router-dom'
import BookCollectionView from '../components/books/BookCollectionView'
import { BOOK_SORT } from '../constants/bookSortOptions'
import { ROUTES } from '../constants/routes'
import { useBooksContext } from '../context/useBooksContext'
import { getFinishedBooks } from '../utils/bookSelectors'

function FinishedPage() {
  const { books } = useBooksContext()

  return (
    <BookCollectionView
      books={getFinishedBooks(books)}
      description="کتاب‌هایی که مطالعه آن‌ها به پایان رسیده است."
      enabledFilters={['category']}
      initialSort={BOOK_SORT.FINISHED_NEWEST}
      sortOptions={[
        { value: BOOK_SORT.FINISHED_NEWEST, label: 'جدیدترین پایان مطالعه' },
        { value: BOOK_SORT.FINISHED_OLDEST, label: 'قدیمی‌ترین پایان مطالعه' },
        { value: BOOK_SORT.TITLE, label: 'نام کتاب' },
        { value: BOOK_SORT.AUTHOR, label: 'نام نویسنده' },
        { value: BOOK_SORT.HIGHEST_RATING, label: 'بیشترین امتیاز' },
        { value: BOOK_SORT.MOST_PAGES, label: 'بیشترین تعداد صفحات' },
      ]}
      storageNamespace="finished"
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
