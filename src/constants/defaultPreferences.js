import { ACCENT_COLOR } from './accentColors'
import { ROUTES } from './routes'
import { THEME } from './themeOptions'
import { VIEW_MODE } from './viewModes'

export const DEFAULT_PREFERENCES = {
  theme: THEME.SYSTEM,
  accentColor: ACCENT_COLOR.INDIGO,
  defaultStartPage: ROUTES.DASHBOARD,
  usePersianDigits: true,
  confirmBeforeDelete: true,
  libraryViewMode: VIEW_MODE.GRID,
  readingViewMode: VIEW_MODE.GRID,
  wishlistViewMode: VIEW_MODE.GRID,
  finishedViewMode: VIEW_MODE.GRID,
}

export const preferenceKeys = Object.keys(DEFAULT_PREFERENCES)
