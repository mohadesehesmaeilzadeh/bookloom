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
    label: 'ضروری',
    rank: 1,
  },
  {
    value: BOOK_PRIORITY.HIGH,
    label: 'زیاد',
    rank: 2,
  },
  {
    value: BOOK_PRIORITY.MEDIUM,
    label: 'متوسط',
    rank: 3,
  },
  {
    value: BOOK_PRIORITY.LOW,
    label: 'کم',
    rank: 4,
  },
]

export const bookPriorityValues = bookPriorities.map((priority) => priority.value)

export const bookPriorityByValue = Object.fromEntries(
  bookPriorities.map((priority) => [priority.value, priority]),
)

export function getBookPriorityLabel(value) {
  return (
    bookPriorityByValue[value]?.label ??
    bookPriorityByValue[DEFAULT_BOOK_PRIORITY].label
  )
}
