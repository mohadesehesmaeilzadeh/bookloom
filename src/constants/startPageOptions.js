import { ROUTES } from './routes'
import { t } from '../i18n/localization'

export const startPageOptions = [
  {
    value: ROUTES.DASHBOARD,
    labelKey: 'nav.dashboard',
  },
  {
    value: ROUTES.LIBRARY,
    labelKey: 'nav.library',
  },
  {
    value: ROUTES.READING,
    labelKey: 'nav.reading',
  },
  {
    value: ROUTES.WISHLIST,
    labelKey: 'nav.wishlist',
  },
  {
    value: ROUTES.FINISHED,
    labelKey: 'nav.finished',
  },
  {
    value: ROUTES.STATISTICS,
    labelKey: 'nav.statistics',
  },
]

export const startPageValues = startPageOptions.map((page) => page.value)

export function getStartPageOptions(language) {
  return startPageOptions.map((page) => ({
    ...page,
    label: t(page.labelKey, undefined, language),
  }))
}
