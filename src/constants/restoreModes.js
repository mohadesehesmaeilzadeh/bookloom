export const RESTORE_MODE = {
  REPLACE: 'replace',
  MERGE: 'merge',
}

export const restoreModes = [
  {
    value: RESTORE_MODE.MERGE,
    label: 'ادغام با اطلاعات فعلی',
    description:
      'اطلاعات فایل پشتیبان با اطلاعات فعلی ترکیب می‌شود و برای کتاب‌های تکراری، نسخه جدیدتر حفظ خواهد شد.',
  },
  {
    value: RESTORE_MODE.REPLACE,
    label: 'جایگزینی اطلاعات فعلی',
    description:
      'تمام اطلاعات فعلی Bookloom با اطلاعات فایل پشتیبان جایگزین می‌شود.',
  },
]
