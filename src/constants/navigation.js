import { ROUTES } from './routes'

export const navigationItems = [
  {
    id: 'dashboard',
    label: 'داشبورد',
    path: ROUTES.DASHBOARD,
  },
  {
    id: 'library',
    label: 'کتابخانه من',
    path: ROUTES.LIBRARY,
  },
  {
    id: 'reading',
    label: 'در حال مطالعه',
    path: ROUTES.READING,
  },
  {
    id: 'wishlist',
    label: 'لیست خرید',
    path: ROUTES.WISHLIST,
  },
  {
    id: 'finished',
    label: 'تمام‌شده‌ها',
    path: ROUTES.FINISHED,
  },
  {
    id: 'statistics',
    label: 'آمار مطالعه',
    path: ROUTES.STATISTICS,
  },
  {
    id: 'settings',
    label: 'تنظیمات',
    path: ROUTES.SETTINGS,
  },
]
