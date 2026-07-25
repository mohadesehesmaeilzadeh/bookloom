import { ROUTES } from './routes'

export const startPageOptions = [
  {
    value: ROUTES.DASHBOARD,
    label: 'داشبورد',
  },
  {
    value: ROUTES.LIBRARY,
    label: 'کتابخانه من',
  },
  {
    value: ROUTES.READING,
    label: 'در حال مطالعه',
  },
  {
    value: ROUTES.WISHLIST,
    label: 'لیست خرید',
  },
  {
    value: ROUTES.FINISHED,
    label: 'تمام‌شده‌ها',
  },
  {
    value: ROUTES.STATISTICS,
    label: 'آمار مطالعه',
  },
]

export const startPageValues = startPageOptions.map((page) => page.value)
