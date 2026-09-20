import { bookPriorityByValue } from '../../constants/bookPriorities'
import { t } from '../../i18n/localization'

export const WISHLIST_SORT = {
  PRIORITY: 'priority',
  NEWEST: 'newest',
  OLDEST: 'oldest',
  PRICE_ASC: 'price-asc',
  PRICE_DESC: 'price-desc',
  TITLE: 'title',
}

export const wishlistSortOptions = [
  {
    value: WISHLIST_SORT.PRIORITY,
    labelKey: 'wishlist.sort.priority',
  },
  {
    value: WISHLIST_SORT.NEWEST,
    labelKey: 'wishlist.sort.newest',
  },
  {
    value: WISHLIST_SORT.OLDEST,
    labelKey: 'wishlist.sort.oldest',
  },
  {
    value: WISHLIST_SORT.PRICE_ASC,
    labelKey: 'wishlist.sort.priceAsc',
  },
  {
    value: WISHLIST_SORT.PRICE_DESC,
    labelKey: 'wishlist.sort.priceDesc',
  },
  {
    value: WISHLIST_SORT.TITLE,
    labelKey: 'wishlist.sort.title',
  },
]

export function getWishlistSortOptions(language) {
  return wishlistSortOptions.map((option) => ({
    ...option,
    label: t(option.labelKey, undefined, language),
  }))
}

function priorityRank(book) {
  return bookPriorityByValue[book.priority]?.rank ?? Number.MAX_SAFE_INTEGER
}

function timestamp(value) {
  const parsed = Date.parse(value)

  return Number.isNaN(parsed) ? 0 : parsed
}

function expectedPrice(book) {
  const price = Number(book.expectedPrice)

  return Number.isFinite(price) && price > 0 ? price : 0
}

export function sortWishlistBooks(books, sortBy = WISHLIST_SORT.PRIORITY) {
  const sortedBooks = [...books]

  if (sortBy === WISHLIST_SORT.NEWEST) {
    return sortedBooks.sort((a, b) => timestamp(b.createdAt) - timestamp(a.createdAt))
  }

  if (sortBy === WISHLIST_SORT.OLDEST) {
    return sortedBooks.sort((a, b) => timestamp(a.createdAt) - timestamp(b.createdAt))
  }

  if (sortBy === WISHLIST_SORT.PRICE_ASC) {
    return sortedBooks.sort((a, b) => expectedPrice(a) - expectedPrice(b))
  }

  if (sortBy === WISHLIST_SORT.PRICE_DESC) {
    return sortedBooks.sort((a, b) => expectedPrice(b) - expectedPrice(a))
  }

  if (sortBy === WISHLIST_SORT.TITLE) {
    return sortedBooks.sort((a, b) => a.title.localeCompare(b.title, 'fa'))
  }

  return sortedBooks.sort((a, b) => {
    const priorityDifference = priorityRank(a) - priorityRank(b)

    if (priorityDifference !== 0) {
      return priorityDifference
    }

    return timestamp(b.createdAt) - timestamp(a.createdAt)
  })
}
