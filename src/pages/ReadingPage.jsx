import { Link } from 'react-router-dom'
import BookCollectionView from '../components/books/BookCollectionView'
import { BOOK_SORT, localizeBookSortOptions } from '../constants/bookSortOptions'
import { ROUTES } from '../constants/routes'
import { useBooksContext } from '../context/useBooksContext'
import { usePreferences } from '../context/usePreferences'
import { getReadingBooks } from '../utils/bookSelectors'
import { sortReadingBooksByActivity } from '../utils/readingProgress'

function ReadingPage() {
  const { books } = useBooksContext()
  const { language, t } = usePreferences()

  return (
    <BookCollectionView
      books={sortReadingBooksByActivity(getReadingBooks(books))}
      description={t('reading.description')}
      enabledFilters={['category']}
      initialSort={BOOK_SORT.RECENTLY_UPDATED}
      sortOptions={localizeBookSortOptions([
        { value: BOOK_SORT.RECENTLY_UPDATED, labelKey: 'sort.recentlyUpdated' },
        { value: BOOK_SORT.HIGHEST_PROGRESS, labelKey: 'sort.highestProgress' },
        { value: BOOK_SORT.TITLE, labelKey: 'sort.title' },
        { value: BOOK_SORT.AUTHOR, labelKey: 'sort.author' },
        { value: BOOK_SORT.READING_STARTED_NEWEST, labelKey: 'sort.readingStartedNewest' },
      ], language.value)}
      showProgressDetails
      storageNamespace="reading"
      emptyDescription={
        <>
          {t('reading.emptyPrefix')}{' '}
          <Link className="inline-link" to={ROUTES.LIBRARY}>
            {t('route.library.title')}
          </Link>
          {t('reading.emptySuffix')}
        </>
      }
      emptyTitle={t('reading.emptyTitle')}
      title={t('route.reading.title')}
    />
  )
}

export default ReadingPage
