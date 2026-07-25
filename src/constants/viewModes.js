export const VIEW_MODE = {
  GRID: 'grid',
  LIST: 'list',
}

export const DEFAULT_VIEW_MODE = VIEW_MODE.GRID

export const viewModes = [
  {
    value: VIEW_MODE.GRID,
    label: 'نمایش کارتی',
  },
  {
    value: VIEW_MODE.LIST,
    label: 'نمایش فهرستی',
  },
]

export const viewModeValues = viewModes.map((mode) => mode.value)
