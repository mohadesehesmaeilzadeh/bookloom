export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
}

export const themeOptions = [
  {
    value: THEME.LIGHT,
    label: 'روشن',
    description: 'همیشه از ظاهر روشن استفاده می‌کند.',
  },
  {
    value: THEME.DARK,
    label: 'تاریک',
    description: 'همیشه از ظاهر تاریک استفاده می‌کند.',
  },
  {
    value: THEME.SYSTEM,
    label: 'مطابق تنظیمات سیستم',
    description: 'ظاهر Bookloom را با تنظیم روشن یا تاریک سیستم هماهنگ می‌کند.',
  },
]

export const themeValues = themeOptions.map((theme) => theme.value)
