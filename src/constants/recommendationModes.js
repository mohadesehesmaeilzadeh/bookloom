export const RECOMMENDATION_MODE = {
  RANDOM: 'random',
  HIGHEST_PRIORITY: 'highestPriority',
  OLDEST_PURCHASE: 'oldestPurchase',
  SHORTEST_BOOK: 'shortestBook',
  SELECTED_CATEGORY: 'selectedCategory',
  WEIGHTED: 'weighted',
}

export const DEFAULT_RECOMMENDATION_MODE = RECOMMENDATION_MODE.WEIGHTED

export const recommendationModes = [
  {
    value: RECOMMENDATION_MODE.WEIGHTED,
    label: 'پیشنهاد ترکیبی',
    description:
      'اولویت، مدت حضور در کتابخانه، کوتاه بودن کتاب، دسته‌بندی دلخواه و وضعیت توقف را با هم می‌سنجد.',
  },
  {
    value: RECOMMENDATION_MODE.RANDOM,
    label: 'انتخاب تصادفی',
    description: 'از میان کتاب‌های قابل پیشنهاد یک گزینه را بدون امتیازدهی انتخاب می‌کند.',
  },
  {
    value: RECOMMENDATION_MODE.HIGHEST_PRIORITY,
    label: 'بیشترین اولویت',
    description: 'کتابی را پیشنهاد می‌دهد که اولویت بالاتری در کتابخانه دارد.',
  },
  {
    value: RECOMMENDATION_MODE.OLDEST_PURCHASE,
    label: 'قدیمی‌ترین خرید',
    description: 'کتابی را پیشنهاد می‌دهد که مدت بیشتری در کتابخانه مانده است.',
  },
  {
    value: RECOMMENDATION_MODE.SHORTEST_BOOK,
    label: 'کوتاه‌ترین کتاب',
    description: 'از میان کتاب‌هایی با تعداد صفحه مشخص، کوتاه‌ترین گزینه را انتخاب می‌کند.',
  },
  {
    value: RECOMMENDATION_MODE.SELECTED_CATEGORY,
    label: 'براساس دسته‌بندی',
    description: 'از دسته‌بندی انتخاب‌شده، یک کتاب قابل مطالعه پیشنهاد می‌دهد.',
  },
]

export const recommendationModeByValue = Object.fromEntries(
  recommendationModes.map((mode) => [mode.value, mode]),
)
