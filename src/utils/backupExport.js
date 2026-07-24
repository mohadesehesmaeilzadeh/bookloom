import {
  BACKUP_APP_NAME,
  CURRENT_BACKUP_SCHEMA_VERSION,
} from '../constants/backupSchema'
import { getTodayDateString } from './dateUtils'
import { normalizeBooks } from './bookValidation'
import { loadCollectionPreferences } from './collectionPreferences'
import { loadReadingGoals } from './readingGoalStorage'

export function createBackupPayload({ books, collectionPreferences, readingGoals }) {
  return {
    app: BACKUP_APP_NAME,
    schemaVersion: CURRENT_BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      books: normalizeBooks(books),
      readingGoals: readingGoals ?? { annualGoals: {} },
      collectionPreferences: collectionPreferences ?? {},
    },
  }
}

export function getCurrentBookloomSnapshot(books) {
  return {
    books: normalizeBooks(books),
    readingGoals: loadReadingGoals(),
    collectionPreferences: loadCollectionPreferences(),
  }
}

export function serializeBackup(backup) {
  try {
    return JSON.stringify(backup, null, 2)
  } catch {
    return ''
  }
}

export function createBackupFilename() {
  return `bookloom-backup-${getTodayDateString()}.json`
}

export function downloadBackupFile(serializedBackup, filename) {
  if (!serializedBackup) {
    return false
  }

  try {
    const blob = new Blob([serializedBackup], { type: 'application/json' })
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = objectUrl
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(objectUrl)

    return true
  } catch {
    return false
  }
}
