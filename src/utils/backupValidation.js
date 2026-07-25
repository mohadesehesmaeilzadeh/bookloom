import {
  BACKUP_APP_NAME,
  CURRENT_BACKUP_SCHEMA_VERSION,
} from '../constants/backupSchema'
import { normalizeBook } from './bookValidation'
import { getBackupSummary } from './backupSummary'
import { normalizePreferences } from './preferenceValidation'
import { normalizeReadingGoals } from './readingGoalStorage'

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isValidTimestamp(value) {
  return typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Date.parse(value))
}

function sanitizeRecord(value) {
  if (!isRecord(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      ([key]) => key !== '__proto__' && key !== 'constructor' && key !== 'prototype',
    ),
  )
}

function sanitizeBook(value) {
  const source = sanitizeRecord(value)

  return {
    ...source,
    quotes: Array.isArray(source.quotes)
      ? source.quotes.map((quote) => sanitizeRecord(quote))
      : [],
  }
}

export function parseBackupFileContent(content) {
  try {
    return {
      parsed: JSON.parse(content),
      success: true,
    }
  } catch {
    return {
      error: 'فایل انتخاب‌شده JSON معتبر نیست.',
      parsed: null,
      success: false,
    }
  }
}

export function validateBackupStructure(parsedBackup) {
  const errors = []
  const warnings = []

  if (!isRecord(parsedBackup)) {
    return {
      errors: ['ساختار فایل پشتیبان معتبر نیست.'],
      normalizedBackup: null,
      valid: false,
      warnings,
    }
  }

  if (parsedBackup.app !== BACKUP_APP_NAME) {
    errors.push('این فایل پشتیبان متعلق به Bookloom نیست.')
  }

  if (!Number.isInteger(parsedBackup.schemaVersion) || parsedBackup.schemaVersion <= 0) {
    errors.push('نسخه فایل پشتیبان معتبر نیست.')
  } else if (parsedBackup.schemaVersion > CURRENT_BACKUP_SCHEMA_VERSION) {
    errors.push('نسخه این فایل پشتیبان توسط نسخه فعلی Bookloom پشتیبانی نمی‌شود.')
  } else if (parsedBackup.schemaVersion < 1) {
    errors.push('نسخه قدیمی این فایل پشتیبان بدون مهاجرت ایمن پشتیبانی نمی‌شود.')
  }

  if (!isValidTimestamp(parsedBackup.exportedAt)) {
    errors.push('تاریخ خروجی گرفتن فایل پشتیبان معتبر نیست.')
  }

  if (!isRecord(parsedBackup.data)) {
    errors.push('بخش اطلاعات فایل پشتیبان معتبر نیست.')
  }

  if (!Array.isArray(parsedBackup.data?.books)) {
    errors.push('فهرست کتاب‌های فایل پشتیبان معتبر نیست.')
  }

  if (errors.length > 0) {
    return {
      errors,
      normalizedBackup: null,
      valid: false,
      warnings,
    }
  }

  const rawBooks = parsedBackup.data.books
  const validBookRecords = rawBooks.filter(isRecord).map(sanitizeBook)

  if (validBookRecords.length < rawBooks.length) {
    warnings.push('برخی رکوردهای نامعتبر کتاب نادیده گرفته شدند.')
  }

  const normalizedBooks = validBookRecords.map((book) => normalizeBook(book))
  const seenBookIds = new Set()
  const duplicateBookIds = new Set()

  for (const book of normalizedBooks) {
    if (seenBookIds.has(book.id)) {
      duplicateBookIds.add(book.id)
    }

    seenBookIds.add(book.id)
  }

  if (duplicateBookIds.size > 0) {
    warnings.push('فایل پشتیبان شامل شناسه تکراری کتاب است؛ هنگام بازیابی نسخه جدیدتر نگه داشته می‌شود.')
  }
  const readingGoals = normalizeReadingGoals(parsedBackup.data.readingGoals)
  const preferences = normalizePreferences(
    parsedBackup.schemaVersion === 1
      ? parsedBackup.data.collectionPreferences
      : parsedBackup.data.preferences,
  )
  const preview = getBackupSummary({
    books: normalizedBooks,
    readingGoals,
    preferences,
  })

  return {
    errors: [],
    normalizedBackup: {
      app: BACKUP_APP_NAME,
      schemaVersion: CURRENT_BACKUP_SCHEMA_VERSION,
      exportedAt: parsedBackup.exportedAt,
      data: {
        books: normalizedBooks,
        readingGoals,
        preferences,
      },
      preview,
    },
    valid: true,
    warnings,
  }
}

export function normalizeBackupData(parsedBackup) {
  return validateBackupStructure(parsedBackup)
}
