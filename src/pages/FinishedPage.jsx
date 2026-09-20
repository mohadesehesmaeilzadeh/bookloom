import { Link } from 'react-router-dom'
import BookCollectionView from '../components/books/BookCollectionView'
import { BOOK_SORT, localizeBookSortOptions } from '../constants/bookSortOptions'
import { ROUTES } from '../constants/routes'
import { useBooksContext } from '../context/useBooksContext'
import { usePreferences } from '../context/usePreferences'
import { getFinishedBooks } from '../utils/bookSelectors'

function FinishedPage() {
  const { books } = useBooksContext()
  const { language, t } = usePreferences()

  return (
    <BookCollectionView
      books={getFinishedBooks(books)}
      description={t('finished.description')}
      enabledFilters={['category']}
      initialSort={BOOK_SORT.FINISHED_NEWEST}
      sortOptions={localizeBookSortOptions([
        { value: BOOK_SORT.FINISHED_NEWEST, labelKey: 'sort.finishedNewest' },
        { value: BOOK_SORT.FINISHED_OLDEST, labelKey: 'sort.finishedOldest' },
        { value: BOOK_SORT.TITLE, labelKey: 'sort.title' },
        { value: BOOK_SORT.AUTHOR, labelKey: 'sort.author' },
        { value: BOOK_SORT.HIGHEST_RATING, labelKey: 'sort.highestRating' },
        { value: BOOK_SORT.MOST_PAGES, labelKey: 'sort.mostPages' },
      ], language.value)}
      storageNamespace="finished"
      emptyDescription={
        <>
          {t('finished.emptyPrefix')}{' '}
          <Link className="inline-link" to={ROUTES.LIBRARY}>
            {t('route.library.title')}
          </Link>
          {t('finished.emptySuffix')}
        </>
      }
      emptyTitle={t('finished.emptyTitle')}
      title={t('route.finished.title')}
    />
  )
}

export default FinishedPage
