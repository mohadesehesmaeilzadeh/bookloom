import { t } from '../i18n/localization'

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
}

export const themeOptions = [
  {
    value: THEME.LIGHT,
    labelKey: 'theme.light.label',
    descriptionKey: 'theme.light.description',
  },
  {
    value: THEME.DARK,
    labelKey: 'theme.dark.label',
    descriptionKey: 'theme.dark.description',
  },
  {
    value: THEME.SYSTEM,
    labelKey: 'theme.system.label',
    descriptionKey: 'theme.system.description',
  },
]

export const themeValues = themeOptions.map((theme) => theme.value)

export function getThemeOptions(language) {
  return themeOptions.map((theme) => ({
    ...theme,
    description: t(theme.descriptionKey, undefined, language),
    label: t(theme.labelKey, undefined, language),
  }))
}
