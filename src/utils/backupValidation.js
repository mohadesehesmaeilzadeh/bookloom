import {
  BACKUP_APP_NAME,
  CURRENT_BACKUP_SCHEMA_VERSION,
} from '../constants/backupSchema'
import { normalizeBook } from './bookValidation'
import { getBackupSummary } from './backupSummary'
import { normalizePreferences } from './preferenceValidation'
import { normalizeReadingGoals } from './readingGoalStorage'
import { t } from '../i18n/localization'

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

export function parseBackupFileContent(content, language) {
  try {
    return {
      parsed: JSON.parse(content),
      success: true,
    }
  } catch {
    return {
      error: t('backup.validation.invalidJson', undefined, language),
      parsed: null,
      success: false,
    }
  }
}

export function validateBackupStructure(parsedBackup, language) {
  const errors = []
  const warnings = []

  if (!isRecord(parsedBackup)) {
    return {
      errors: [t('backup.validation.invalidStructure', undefined, language)],
      normalizedBackup: null,
      valid: false,
      warnings,
    }
  }

  if (parsedBackup.app !== BACKUP_APP_NAME) {
    errors.push(t('backup.validation.wrongApp', undefined, language))
  }

  if (!Number.isInteger(parsedBackup.schemaVersion) || parsedBackup.schemaVersion <= 0) {
    errors.push(t('backup.validation.invalidVersion', undefined, language))
  } else if (parsedBackup.schemaVersion > CURRENT_BACKUP_SCHEMA_VERSION) {
    errors.push(t('backup.validation.futureVersion', undefined, language))
  } else if (parsedBackup.schemaVersion < 1) {
    errors.push(t('backup.validation.oldVersion', undefined, language))
  }

  if (!isValidTimestamp(parsedBackup.exportedAt)) {
    errors.push(t('backup.validation.invalidDate', undefined, language))
  }

  if (!isRecord(parsedBackup.data)) {
    errors.push(t('backup.validation.invalidData', undefined, language))
  }

  if (!Array.isArray(parsedBackup.data?.books)) {
    errors.push(t('backup.validation.invalidBooks', undefined, language))
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
    warnings.push(t('backup.validation.skippedBooks', undefined, language))
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
    warnings.push(t('backup.validation.duplicateBooks', undefined, language))
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

export function normalizeBackupData(parsedBackup, language) {
  return validateBackupStructure(parsedBackup, language)
}
