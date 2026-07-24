import BookCollectionView from '../components/books/BookCollectionView'
import { BOOK_SORT, getBookSortOptions } from '../constants/bookSortOptions'
import { useBooksContext } from '../context/useBooksContext'
import { getLibraryBooks } from '../utils/bookSelectors'

function LibraryPage() {
  const { books } = useBooksContext()

  return (
    <BookCollectionView
      addButtonLabel="افزودن کتاب"
      allowCreate
      books={getLibraryBooks(books)}
      description="کتاب‌های ثبت‌شده را ببینید، کتاب تازه اضافه کنید و اطلاعات پایه هر کتاب را ویرایش کنید."
      enabledFilters={['category', 'status', 'priority']}
      emptyActionLabel="افزودن اولین کتاب"
      emptyDescription="اولین کتابت را اضافه کن تا Bookloom کم‌کم به کتابخانه شخصی تو تبدیل شود."
      emptyTitle="هنوز کتابی در کتابخانه ثبت نشده است."
      initialSort={BOOK_SORT.NEWEST}
      noResultsDescription="جست‌وجو، دسته‌بندی، وضعیت یا اولویت را تغییر بده."
      sortOptions={getBookSortOptions([
        BOOK_SORT.NEWEST,
        BOOK_SORT.OLDEST,
        BOOK_SORT.TITLE,
        BOOK_SORT.AUTHOR,
        BOOK_SORT.HIGHEST_PROGRESS,
        BOOK_SORT.HIGHEST_RATING,
        BOOK_SORT.LOWEST_PRICE,
        BOOK_SORT.HIGHEST_PRICE,
        BOOK_SORT.RECENTLY_UPDATED,
      ])}
      storageNamespace="library"
      title="کتابخانه من"
    />
  )
}

export default LibraryPage
