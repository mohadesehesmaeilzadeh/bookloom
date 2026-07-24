import BookCollectionView from '../components/books/BookCollectionView'
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
      emptyActionLabel="افزودن اولین کتاب"
      emptyDescription="اولین کتابت را اضافه کن تا Bookloom کم‌کم به کتابخانه شخصی تو تبدیل شود."
      emptyTitle="هنوز کتابی در کتابخانه ثبت نشده است."
      title="کتابخانه من"
    />
  )
}

export default LibraryPage
