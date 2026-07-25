export const BOOK_STATUS = {
  WISHLIST: 'wishlist',
  OWNED: 'owned',
  READING: 'reading',
  PAUSED: 'paused',
  FINISHED: 'finished',
  ABANDONED: 'abandoned',
}

export const DEFAULT_BOOK_STATUS = BOOK_STATUS.OWNED

export const bookStatuses = [
  {
    value: BOOK_STATUS.WISHLIST,
    label: 'لیست خرید',
    description: 'کتابی که قصد خرید یا تهیه آن را دارید.',
    key: 'wishlist',
  },
  {
    value: BOOK_STATUS.OWNED,
    label: 'خریداری‌شده',
    description: 'کتابی که تهیه شده و در کتابخانه شخصی شماست.',
    key: 'owned',
  },
  {
    value: BOOK_STATUS.READING,
    label: 'در حال مطالعه',
    description: 'کتابی که اکنون در حال خواندن آن هستید.',
    key: 'reading',
  },
  {
    value: BOOK_STATUS.PAUSED,
    label: 'متوقف‌شده',
    description: 'کتابی که خواندن آن فعلا متوقف شده است.',
    key: 'paused',
  },
  {
    value: BOOK_STATUS.FINISHED,
    label: 'تمام‌شده',
    description: 'کتابی که مطالعه آن به پایان رسیده است.',
    key: 'finished',
  },
  {
    value: BOOK_STATUS.ABANDONED,
    label: 'رهاشده',
    description: 'کتابی که تصمیم گرفته‌اید ادامه ندهید.',
    key: 'abandoned',
  },
]

export const bookStatusValues = bookStatuses.map((status) => status.value)

export const bookStatusByValue = Object.fromEntries(
  bookStatuses.map((status) => [status.value, status]),
)

export function getBookStatusLabel(value) {
  return bookStatusByValue[value]?.label ?? bookStatusByValue[DEFAULT_BOOK_STATUS].label
}
