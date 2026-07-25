import { BOOK_STATUS_ACTION } from '../constants/bookStatusTransitions'
import { getTodayDateString } from './dateUtils'

export function createStatusTransitionUpdates(book, transition) {
  const today = getTodayDateString()
  const updates = {
    status: transition.targetStatus,
  }

  if (transition.action === BOOK_STATUS_ACTION.START_READING) {
    updates.readingStartDate = book.readingStartDate || today
  }

  if (transition.action === BOOK_STATUS_ACTION.FINISH_READING) {
    updates.readingEndDate = today

    if (book.totalPages > 0) {
      updates.currentPage = book.totalPages
    }
  }

  return updates
}
