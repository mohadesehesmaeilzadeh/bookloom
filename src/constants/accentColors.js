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
    label: 'نیلی',
    cssValue: '#4f5d95',
  },
  {
    value: ACCENT_COLOR.EMERALD,
    label: 'سبز زمردی',
    cssValue: '#2f6f5e',
  },
  {
    value: ACCENT_COLOR.ROSE,
    label: 'صورتی ملایم',
    cssValue: '#9f4d67',
  },
  {
    value: ACCENT_COLOR.AMBER,
    label: 'کهربایی',
    cssValue: '#996515',
  },
  {
    value: ACCENT_COLOR.SLATE,
    label: 'خاکستری',
    cssValue: '#526173',
  },
]

export const accentColorValues = accentColorOptions.map((color) => color.value)
