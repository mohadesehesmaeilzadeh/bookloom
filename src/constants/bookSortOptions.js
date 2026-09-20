import { t } from '../i18n/localization'

export const BOOK_SORT = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  TITLE: 'title',
  AUTHOR: 'author',
  HIGHEST_RATING: 'highestRating',
  HIGHEST_PROGRESS: 'highestProgress',
  LOWEST_PRICE: 'lowestPrice',
  HIGHEST_PRICE: 'highestPrice',
  RECENTLY_UPDATED: 'recentlyUpdated',
  READING_STARTED_NEWEST: 'readingStartedNewest',
  FINISHED_NEWEST: 'finishedNewest',
  FINISHED_OLDEST: 'finishedOldest',
  MOST_PAGES: 'mostPages',
}

export const bookSortOptions = [
  { value: BOOK_SORT.NEWEST, labelKey: 'sort.newest' },
  { value: BOOK_SORT.OLDEST, labelKey: 'sort.oldest' },
  { value: BOOK_SORT.TITLE, labelKey: 'sort.title' },
  { value: BOOK_SORT.AUTHOR, labelKey: 'sort.author' },
  { value: BOOK_SORT.HIGHEST_RATING, labelKey: 'sort.highestRating' },
  { value: BOOK_SORT.HIGHEST_PROGRESS, labelKey: 'sort.highestProgress' },
  { value: BOOK_SORT.LOWEST_PRICE, labelKey: 'sort.lowestPrice' },
  { value: BOOK_SORT.HIGHEST_PRICE, labelKey: 'sort.highestPrice' },
  { value: BOOK_SORT.RECENTLY_UPDATED, labelKey: 'sort.recentlyUpdated' },
]

export function localizeBookSortOptions(options, language) {
  return options.map((option) => ({
    ...option,
    label: option.label ?? t(option.labelKey, undefined, language),
  }))
}

export function getBookSortOptions(values, language) {
  return localizeBookSortOptions(
    bookSortOptions.filter((option) => values.includes(option.value)),
    language,
  )
}
