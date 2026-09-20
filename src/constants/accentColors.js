import { t } from '../i18n/localization'

export const ACCENT_COLOR = {
  INDIGO: 'indigo',
  EMERALD: 'emerald',
  ROSE: 'rose',
  AMBER: 'amber',
  SLATE: 'slate',
}

export const accentColorOptions = [
  {
    value: ACCENT_COLOR.INDIGO,
    labelKey: 'accent.indigo',
    cssValue: '#4f5d95',
  },
  {
    value: ACCENT_COLOR.EMERALD,
    labelKey: 'accent.emerald',
    cssValue: '#2f6f5e',
  },
  {
    value: ACCENT_COLOR.ROSE,
    labelKey: 'accent.rose',
    cssValue: '#9f4d67',
  },
  {
    value: ACCENT_COLOR.AMBER,
    labelKey: 'accent.amber',
    cssValue: '#996515',
  },
  {
    value: ACCENT_COLOR.SLATE,
    labelKey: 'accent.slate',
    cssValue: '#526173',
  },
]

export const accentColorValues = accentColorOptions.map((color) => color.value)

export function getAccentColorOptions(language) {
  return accentColorOptions.map((accentColor) => ({
    ...accentColor,
    label: t(accentColor.labelKey, undefined, language),
  }))
}
