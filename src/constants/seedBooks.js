import { BOOK_PRIORITY } from './bookPriorities'
import { BOOK_STATUS } from './bookStatuses'

export const ENABLE_DEVELOPMENT_SEED = false

export const seedBooks = [
  {
    title: 'سووشون',
    author: 'سیمین دانشور',
    publisher: 'خوارزمی',
    category: 'رمان',
    status: BOOK_STATUS.OWNED,
    priority: BOOK_PRIORITY.MEDIUM,
  },
  {
    title: 'کلیدر',
    author: 'محمود دولت‌آبادی',
    publisher: 'فرهنگ معاصر',
    category: 'رمان',
    status: BOOK_STATUS.READING,
    totalPages: 2836,
    currentPage: 120,
    priority: BOOK_PRIORITY.HIGH,
  },
  {
    title: 'چشم‌هایش',
    author: 'بزرگ علوی',
    category: 'رمان',
    status: BOOK_STATUS.WISHLIST,
    priority: BOOK_PRIORITY.URGENT,
  },
]
