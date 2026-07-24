export const ROUTES = {
  DASHBOARD: '/',
  LIBRARY: '/library',
  READING: '/reading',
  WISHLIST: '/wishlist',
  FINISHED: '/finished',
  STATISTICS: '/statistics',
  SETTINGS: '/settings',
  BOOK_DETAILS: '/books/:bookId',
}

export const routeTitles = [
  {
    path: ROUTES.DASHBOARD,
    title: 'داشبورد',
    eyebrow: 'نمای کلی',
    end: true,
  },
  {
    path: ROUTES.LIBRARY,
    title: 'کتابخانه من',
    eyebrow: 'کتاب‌ها',
  },
  {
    path: ROUTES.READING,
    title: 'در حال مطالعه',
    eyebrow: 'مطالعه',
  },
  {
    path: ROUTES.WISHLIST,
    title: 'لیست خرید',
    eyebrow: 'خرید',
  },
  {
    path: ROUTES.FINISHED,
    title: 'کتاب‌های تمام‌شده',
    eyebrow: 'پایان مطالعه',
  },
  {
    path: ROUTES.STATISTICS,
    title: 'آمار مطالعه',
    eyebrow: 'آمار',
  },
  {
    path: ROUTES.SETTINGS,
    title: 'تنظیمات',
    eyebrow: 'پیکربندی',
  },
  {
    path: ROUTES.BOOK_DETAILS,
    title: 'جزئیات کتاب',
    eyebrow: 'کتاب',
  },
]

export function getBookDetailsPath(bookId) {
  return `/books/${encodeURIComponent(bookId)}`
}
