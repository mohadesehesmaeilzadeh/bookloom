import { ROUTES } from './routes'
import { t } from '../i18n/localization'

export const navigationItems = [
  {
    id: 'dashboard',
    labelKey: 'nav.dashboard',
    path: ROUTES.DASHBOARD,
  },
  {
    id: 'library',
    labelKey: 'nav.library',
    path: ROUTES.LIBRARY,
  },
  {
    id: 'reading',
    labelKey: 'nav.reading',
    path: ROUTES.READING,
  },
  {
    id: 'wishlist',
    labelKey: 'nav.wishlist',
    path: ROUTES.WISHLIST,
  },
  {
    id: 'finished',
    labelKey: 'nav.finished',
    path: ROUTES.FINISHED,
  },
  {
    id: 'statistics',
    labelKey: 'nav.statistics',
    path: ROUTES.STATISTICS,
  },
  {
    id: 'settings',
    labelKey: 'nav.settings',
    path: ROUTES.SETTINGS,
  },
]

export function getNavigationItems(language) {
  return navigationItems.map((item) => ({
    ...item,
    label: t(item.labelKey, undefined, language),
  }))
}
