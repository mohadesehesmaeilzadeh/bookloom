import { BOOK_STATUS } from './bookStatuses'

export const BOOK_STATUS_ACTION = {
  START_READING: 'start-reading',
  PAUSE_READING: 'pause-reading',
  RESUME_READING: 'resume-reading',
  FINISH_READING: 'finish-reading',
  ABANDON_BOOK: 'abandon-book',
  RETURN_TO_LIBRARY: 'return-to-library',
}

export const bookStatusTransitions = {
  [BOOK_STATUS.WISHLIST]: [],
  [BOOK_STATUS.OWNED]: [
    {
      action: BOOK_STATUS_ACTION.START_READING,
      label: 'شروع مطالعه',
      targetStatus: BOOK_STATUS.READING,
      requiresConfirmation: false,
      cardAction: true,
    },
    {
      action: BOOK_STATUS_ACTION.ABANDON_BOOK,
      label: 'رها کردن کتاب',
      targetStatus: BOOK_STATUS.ABANDONED,
      requiresConfirmation: true,
      confirmationTitle: 'رها کردن کتاب',
      confirmationMessage:
        'آیا مطمئن هستید که می‌خواهید این کتاب را رهاشده علامت بزنید؟',
    },
  ],
  [BOOK_STATUS.READING]: [
    {
      action: BOOK_STATUS_ACTION.PAUSE_READING,
      label: 'توقف موقت',
      targetStatus: BOOK_STATUS.PAUSED,
      requiresConfirmation: false,
      cardAction: true,
    },
    {
      action: BOOK_STATUS_ACTION.FINISH_READING,
      label: 'تمام شد',
      targetStatus: BOOK_STATUS.FINISHED,
      requiresConfirmation: true,
      confirmationTitle: 'تمام شدن مطالعه',
      confirmationMessage: 'آیا مطالعه این کتاب تمام شده است؟',
    },
    {
      action: BOOK_STATUS_ACTION.ABANDON_BOOK,
      label: 'رها کردن کتاب',
      targetStatus: BOOK_STATUS.ABANDONED,
      requiresConfirmation: true,
      confirmationTitle: 'رها کردن کتاب',
      confirmationMessage:
        'آیا مطمئن هستید که می‌خواهید این کتاب را رهاشده علامت بزنید؟',
    },
  ],
  [BOOK_STATUS.PAUSED]: [
    {
      action: BOOK_STATUS_ACTION.RESUME_READING,
      label: 'ادامه مطالعه',
      targetStatus: BOOK_STATUS.READING,
      requiresConfirmation: false,
      cardAction: true,
    },
    {
      action: BOOK_STATUS_ACTION.FINISH_READING,
      label: 'تمام شد',
      targetStatus: BOOK_STATUS.FINISHED,
      requiresConfirmation: true,
      confirmationTitle: 'تمام شدن مطالعه',
      confirmationMessage: 'آیا مطالعه این کتاب تمام شده است؟',
    },
    {
      action: BOOK_STATUS_ACTION.ABANDON_BOOK,
      label: 'رها کردن کتاب',
      targetStatus: BOOK_STATUS.ABANDONED,
      requiresConfirmation: true,
      confirmationTitle: 'رها کردن کتاب',
      confirmationMessage:
        'آیا مطمئن هستید که می‌خواهید این کتاب را رهاشده علامت بزنید؟',
    },
  ],
  [BOOK_STATUS.FINISHED]: [],
  [BOOK_STATUS.ABANDONED]: [
    {
      action: BOOK_STATUS_ACTION.RETURN_TO_LIBRARY,
      label: 'بازگرداندن به کتابخانه',
      targetStatus: BOOK_STATUS.OWNED,
      requiresConfirmation: false,
    },
  ],
}

export function getStatusTransitions(status) {
  return bookStatusTransitions[status] ?? []
}

export function getCardStatusTransition(status) {
  return getStatusTransitions(status).find((transition) => transition.cardAction) ?? null
}
