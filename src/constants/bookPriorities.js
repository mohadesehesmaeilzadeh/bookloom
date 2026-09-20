import { t } from '../i18n/localization'

export const BOOK_PRIORITY = {
  URGENT: 'urgent',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
}

export const DEFAULT_BOOK_PRIORITY = BOOK_PRIORITY.MEDIUM

export const bookPriorities = [
  {
    value: BOOK_PRIORITY.URGENT,
    labelKey: 'priority.urgent',
    rank: 1,
  },
  {
    value: BOOK_PRIORITY.HIGH,
    labelKey: 'priority.high',
    rank: 2,
  },
  {
    value: BOOK_PRIORITY.MEDIUM,
    labelKey: 'priority.medium',
    rank: 3,
  },
  {
    value: BOOK_PRIORITY.LOW,
    labelKey: 'priority.low',
    rank: 4,
  },
]

export const bookPriorityValues = bookPriorities.map((priority) => priority.value)

export const bookPriorityByValue = Object.fromEntries(
  bookPriorities.map((priority) => [priority.value, priority]),
)

export function getBookPriorities(language) {
  return bookPriorities.map((priority) => ({
    ...priority,
    label: t(priority.labelKey, undefined, language),
  }))
}

export function getBookPriorityLabel(value, language) {
  const priority = bookPriorityByValue[value] ?? bookPriorityByValue[DEFAULT_BOOK_PRIORITY]

  return t(priority.labelKey, undefined, language)
}
