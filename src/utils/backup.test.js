import { describe, expect, it } from 'vitest'
import { CURRENT_BACKUP_SCHEMA_VERSION } from '../constants/backupSchema'
import { createBackupPayload, serializeBackup } from './backupExport'
import { createMergedBookloomData } from './backupMerge'
import { parseBackupFileContent, validateBackupStructure } from './backupValidation'

const session = {
  id: 'session-1',
  startedAt: '2026-09-21T10:00:00.000Z',
  endedAt: '2026-09-21T10:30:00.000Z',
  durationMs: 1_800_000,
  pagesRead: 12,
}

describe('backup and restore', () => {
  it('round-trips books and reading sessions through export validation', () => {
    const payload = createBackupPayload({
      books: [{ id: 'one', title: 'Book One', status: 'reading', readingSessions: [session] }],
      preferences: {},
      readingGoals: { annualGoals: {} },
    })
    const parsed = parseBackupFileContent(serializeBackup(payload), 'en')
    const validation = validateBackupStructure(parsed.parsed, 'en')

    expect(parsed.success).toBe(true)
    expect(validation.valid).toBe(true)
    expect(validation.normalizedBackup.data.books[0].readingSessions[0]).toMatchObject(session)
  })

  it('rejects malformed JSON and unsupported future backups', () => {
    expect(parseBackupFileContent('{', 'en').success).toBe(false)

    const payload = createBackupPayload({ books: [], preferences: {} })
    expect(validateBackupStructure({
      ...payload,
      schemaVersion: CURRENT_BACKUP_SCHEMA_VERSION + 1,
    }, 'en').valid).toBe(false)
  })

  it('merges imported books by ID and newer update time without losing local-only books', () => {
    const current = {
      books: [
        { id: 'shared', title: 'Old', updatedAt: '2026-09-01T00:00:00.000Z' },
        { id: 'local', title: 'Local', updatedAt: '2026-09-01T00:00:00.000Z' },
      ],
      readingGoals: { annualGoals: {} },
      preferences: {},
    }
    const imported = {
      books: [
        { id: 'shared', title: 'New', updatedAt: '2026-09-02T00:00:00.000Z' },
        { id: 'added', title: 'Added', updatedAt: '2026-09-02T00:00:00.000Z' },
      ],
      readingGoals: { annualGoals: {} },
      preferences: {},
    }

    const merged = createMergedBookloomData(current, imported, 'en')

    expect(merged.data.books).toHaveLength(3)
    expect(merged.data.books.find((book) => book.id === 'shared').title).toBe('New')
    expect(merged.data.books.find((book) => book.id === 'local').title).toBe('Local')
    expect(merged.summary.books).toMatchObject({ added: 1, updated: 1, keptLocal: 1 })
  })
})
