import { BOOK_STATUS } from './bookStatuses'
import { t } from '../i18n/localization'

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
      labelKey: 'statusAction.start-reading.label',
      targetStatus: BOOK_STATUS.READING,
      requiresConfirmation: false,
      cardAction: true,
    },
    {
      action: BOOK_STATUS_ACTION.ABANDON_BOOK,
      labelKey: 'statusAction.abandon-book.label',
      targetStatus: BOOK_STATUS.ABANDONED,
      requiresConfirmation: true,
      confirmationTitleKey: 'statusAction.abandon-book.title',
      confirmationMessageKey: 'statusAction.abandon-book.message',
    },
  ],
  [BOOK_STATUS.READING]: [
    {
      action: BOOK_STATUS_ACTION.PAUSE_READING,
      labelKey: 'statusAction.pause-reading.label',
      targetStatus: BOOK_STATUS.PAUSED,
      requiresConfirmation: false,
      cardAction: true,
    },
    {
      action: BOOK_STATUS_ACTION.FINISH_READING,
      labelKey: 'statusAction.finish-reading.label',
      targetStatus: BOOK_STATUS.FINISHED,
      requiresConfirmation: true,
      confirmationTitleKey: 'statusAction.finish-reading.title',
      confirmationMessageKey: 'statusAction.finish-reading.message',
    },
    {
      action: BOOK_STATUS_ACTION.ABANDON_BOOK,
      labelKey: 'statusAction.abandon-book.label',
      targetStatus: BOOK_STATUS.ABANDONED,
      requiresConfirmation: true,
      confirmationTitleKey: 'statusAction.abandon-book.title',
      confirmationMessageKey: 'statusAction.abandon-book.message',
    },
  ],
  [BOOK_STATUS.PAUSED]: [
    {
      action: BOOK_STATUS_ACTION.RESUME_READING,
      labelKey: 'statusAction.resume-reading.label',
      targetStatus: BOOK_STATUS.READING,
      requiresConfirmation: false,
      cardAction: true,
    },
    {
      action: BOOK_STATUS_ACTION.FINISH_READING,
      labelKey: 'statusAction.finish-reading.label',
      targetStatus: BOOK_STATUS.FINISHED,
      requiresConfirmation: true,
      confirmationTitleKey: 'statusAction.finish-reading.title',
      confirmationMessageKey: 'statusAction.finish-reading.message',
    },
    {
      action: BOOK_STATUS_ACTION.ABANDON_BOOK,
      labelKey: 'statusAction.abandon-book.label',
      targetStatus: BOOK_STATUS.ABANDONED,
      requiresConfirmation: true,
      confirmationTitleKey: 'statusAction.abandon-book.title',
      confirmationMessageKey: 'statusAction.abandon-book.message',
    },
  ],
  [BOOK_STATUS.FINISHED]: [],
  [BOOK_STATUS.ABANDONED]: [
    {
      action: BOOK_STATUS_ACTION.RETURN_TO_LIBRARY,
      labelKey: 'statusAction.return-to-library.label',
      targetStatus: BOOK_STATUS.OWNED,
      requiresConfirmation: false,
    },
  ],
}

export function getStatusTransitions(status) {
  return bookStatusTransitions[status] ?? []
}

export function localizeStatusTransition(transition, language) {
  if (!transition) {
    return null
  }

  return {
    ...transition,
    confirmationMessage: transition.confirmationMessageKey
      ? t(transition.confirmationMessageKey, undefined, language)
      : undefined,
    confirmationTitle: transition.confirmationTitleKey
      ? t(transition.confirmationTitleKey, undefined, language)
      : undefined,
    label: t(transition.labelKey, undefined, language),
  }
}

export function getLocalizedStatusTransitions(status, language) {
  return getStatusTransitions(status).map((transition) =>
    localizeStatusTransition(transition, language),
  )
}

export function getCardStatusTransition(status) {
  return getStatusTransitions(status).find((transition) => transition.cardAction) ?? null
}

export function getLocalizedCardStatusTransition(status, language) {
  return localizeStatusTransition(getCardStatusTransition(status), language)
}
