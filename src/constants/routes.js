import { t } from '../i18n/localization'

export const ROUTES = {
  DASHBOARD: '/',
  LIBRARY: '/library',
  READING: '/reading',
  WISHLIST: '/wishlist',
  FINISHED: '/finished',
  STATISTICS: '/statistics',
  SETTINGS: '/settings',
  BOOK_DETAILS: '/books/:bookId',
}

export const routeTitles = [
  {
    path: ROUTES.DASHBOARD,
    titleKey: 'route.dashboard.title',
    eyebrowKey: 'route.dashboard.eyebrow',
    end: true,
  },
  {
    path: ROUTES.LIBRARY,
    titleKey: 'route.library.title',
    eyebrowKey: 'route.library.eyebrow',
  },
  {
    path: ROUTES.READING,
    titleKey: 'route.reading.title',
    eyebrowKey: 'route.reading.eyebrow',
  },
  {
    path: ROUTES.WISHLIST,
    titleKey: 'route.wishlist.title',
    eyebrowKey: 'route.wishlist.eyebrow',
  },
  {
    path: ROUTES.FINISHED,
    titleKey: 'route.finished.title',
    eyebrowKey: 'route.finished.eyebrow',
  },
  {
    path: ROUTES.STATISTICS,
    titleKey: 'route.statistics.title',
    eyebrowKey: 'route.statistics.eyebrow',
  },
  {
    path: ROUTES.SETTINGS,
    titleKey: 'route.settings.title',
    eyebrowKey: 'route.settings.eyebrow',
  },
  {
    path: ROUTES.BOOK_DETAILS,
    titleKey: 'route.bookDetails.title',
    eyebrowKey: 'route.bookDetails.eyebrow',
  },
]

export function getRouteTitles(language) {
  return routeTitles.map((route) => ({
    ...route,
    eyebrow: t(route.eyebrowKey, undefined, language),
    title: t(route.titleKey, undefined, language),
  }))
}

export function getBookDetailsPath(bookId) {
  return `/books/${encodeURIComponent(bookId)}`
}
