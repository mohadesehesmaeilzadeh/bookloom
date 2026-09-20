import BookCollectionView from '../components/books/BookCollectionView'
import RecommendationButton from '../components/recommendations/RecommendationButton'
import { BOOK_SORT, getBookSortOptions } from '../constants/bookSortOptions'
import { useBooksContext } from '../context/useBooksContext'
import { usePreferences } from '../context/usePreferences'
import { getLibraryBooks } from '../utils/bookSelectors'

function LibraryPage() {
  const { books } = useBooksContext()
  const { language, t } = usePreferences()

  return (
    <BookCollectionView
      addButtonLabel={t('books.addBook')}
      allowCreate
      books={getLibraryBooks(books)}
      description={t('library.description')}
      enabledFilters={['category', 'status', 'priority']}
      emptyActionLabel={t('library.emptyAction')}
      emptyDescription={t('library.emptyDescription')}
      emptyTitle={t('library.emptyTitle')}
      initialSort={BOOK_SORT.NEWEST}
      noResultsDescription={t('library.noResultsDescription')}
      renderHeaderActions={({ setFeedback }) => (
        <RecommendationButton onFeedback={setFeedback} />
      )}
      sortOptions={getBookSortOptions(
        [
          BOOK_SORT.NEWEST,
          BOOK_SORT.OLDEST,
          BOOK_SORT.TITLE,
          BOOK_SORT.AUTHOR,
          BOOK_SORT.HIGHEST_PROGRESS,
          BOOK_SORT.HIGHEST_RATING,
          BOOK_SORT.LOWEST_PRICE,
          BOOK_SORT.HIGHEST_PRICE,
          BOOK_SORT.RECENTLY_UPDATED,
        ],
        language.value,
      )}
      storageNamespace="library"
      title={t('route.library.title')}
    />
  )
}

export default LibraryPage
