import { bookPriorityByValue } from '../../constants/bookPriorities'

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
    label: 'بالاترین اولویت',
  },
  {
    value: WISHLIST_SORT.NEWEST,
    label: 'جدیدترین',
  },
  {
    value: WISHLIST_SORT.OLDEST,
    label: 'قدیمی‌ترین',
  },
  {
    value: WISHLIST_SORT.PRICE_ASC,
    label: 'کمترین قیمت تقریبی',
  },
  {
    value: WISHLIST_SORT.PRICE_DESC,
    label: 'بیشترین قیمت تقریبی',
  },
  {
    value: WISHLIST_SORT.TITLE,
    label: 'نام کتاب',
  },
]

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
