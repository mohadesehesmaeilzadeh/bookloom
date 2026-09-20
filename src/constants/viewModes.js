import { t } from '../i18n/localization'

export const VIEW_MODE = {
  GRID: 'grid',
  LIST: 'list',
}

export const DEFAULT_VIEW_MODE = VIEW_MODE.GRID

export const viewModes = [
  {
    value: VIEW_MODE.GRID,
    labelKey: 'view.grid',
  },
  {
    value: VIEW_MODE.LIST,
    labelKey: 'view.list',
  },
]

export const viewModeValues = viewModes.map((mode) => mode.value)

export function getViewModes(language) {
  return viewModes.map((mode) => ({
    ...mode,
    label: t(mode.labelKey, undefined, language),
  }))
}
