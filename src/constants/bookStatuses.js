import { t } from '../i18n/localization'

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
    labelKey: 'status.wishlist.label',
    descriptionKey: 'status.wishlist.description',
    key: 'wishlist',
  },
  {
    value: BOOK_STATUS.OWNED,
    labelKey: 'status.owned.label',
    descriptionKey: 'status.owned.description',
    key: 'owned',
  },
  {
    value: BOOK_STATUS.READING,
    labelKey: 'status.reading.label',
    descriptionKey: 'status.reading.description',
    key: 'reading',
  },
  {
    value: BOOK_STATUS.PAUSED,
    labelKey: 'status.paused.label',
    descriptionKey: 'status.paused.description',
    key: 'paused',
  },
  {
    value: BOOK_STATUS.FINISHED,
    labelKey: 'status.finished.label',
    descriptionKey: 'status.finished.description',
    key: 'finished',
  },
  {
    value: BOOK_STATUS.ABANDONED,
    labelKey: 'status.abandoned.label',
    descriptionKey: 'status.abandoned.description',
    key: 'abandoned',
  },
]

export const bookStatusValues = bookStatuses.map((status) => status.value)

export const bookStatusByValue = Object.fromEntries(
  bookStatuses.map((status) => [status.value, status]),
)

export function getBookStatuses(language) {
  return bookStatuses.map((status) => ({
    ...status,
    description: t(status.descriptionKey, undefined, language),
    label: t(status.labelKey, undefined, language),
  }))
}

export function getBookStatusLabel(value, language) {
  const status = bookStatusByValue[value] ?? bookStatusByValue[DEFAULT_BOOK_STATUS]

  return t(status.labelKey, undefined, language)
}
