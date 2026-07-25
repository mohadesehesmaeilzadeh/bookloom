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
  { value: BOOK_SORT.NEWEST, label: 'جدیدترین' },
  { value: BOOK_SORT.OLDEST, label: 'قدیمی‌ترین' },
  { value: BOOK_SORT.TITLE, label: 'نام کتاب' },
  { value: BOOK_SORT.AUTHOR, label: 'نام نویسنده' },
  { value: BOOK_SORT.HIGHEST_RATING, label: 'بیشترین امتیاز' },
  { value: BOOK_SORT.HIGHEST_PROGRESS, label: 'بیشترین پیشرفت' },
  { value: BOOK_SORT.LOWEST_PRICE, label: 'کمترین قیمت' },
  { value: BOOK_SORT.HIGHEST_PRICE, label: 'بیشترین قیمت' },
  { value: BOOK_SORT.RECENTLY_UPDATED, label: 'آخرین به‌روزرسانی' },
]

export function getBookSortOptions(values) {
  return bookSortOptions.filter((option) => values.includes(option.value))
}
