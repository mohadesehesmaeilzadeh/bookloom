import { useCallback, useMemo, useRef, useState } from 'react'
import BackupExportSection from '../components/settings/BackupExportSection'
import BackupImportSection from '../components/settings/BackupImportSection'
import ResetBookloomData from '../components/settings/ResetBookloomData'
import ConfirmDialog from '../components/common/ConfirmDialog'
import FeedbackMessage from '../components/common/FeedbackMessage'
import { MAX_BACKUP_FILE_SIZE_BYTES } from '../constants/backupSchema'
import { RESTORE_MODE } from '../constants/restoreModes'
import { useBooksContext } from '../context/useBooksContext'
import {
  createBackupFilename,
  createBackupPayload,
  downloadBackupFile,
  getCurrentBookloomSnapshot,
  serializeBackup,
} from '../utils/backupExport'
import { createMergedBookloomData, resolveImportedBookDuplicates } from '../utils/backupMerge'
import { getBackupSummary } from '../utils/backupSummary'
import { parseBackupFileContent, validateBackupStructure } from '../utils/backupValidation'
import { clearBooks } from '../utils/bookStorage'
import {
  clearCollectionPreferences,
  saveCollectionPreferences,
} from '../utils/collectionPreferences'
import { formatNumber } from '../utils/formatNumber'
import { clearReadingGoals, saveReadingGoals } from '../utils/readingGoalStorage'

function SettingsPage() {
  const { books, replaceBooks } = useBooksContext()
  const fileInputRef = useRef(null)
  const [feedback, setFeedback] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileErrors, setFileErrors] = useState([])
  const [fileWarnings, setFileWarnings] = useState([])
  const [validationResult, setValidationResult] = useState(null)
  const [restoreMode, setRestoreMode] = useState(RESTORE_MODE.MERGE)
  const [pendingRestoreMode, setPendingRestoreMode] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const currentSnapshot = useMemo(() => getCurrentBookloomSnapshot(books), [books])
  const currentSummary = useMemo(() => getBackupSummary(currentSnapshot), [currentSnapshot])
  const mergePreview = useMemo(() => {
    if (!validationResult?.valid) {
      return null
    }

    return createMergedBookloomData(currentSnapshot, validationResult.normalizedBackup.data)
  }, [currentSnapshot, validationResult])

  const resetImportState = useCallback(() => {
    setFileName('')
    setFileErrors([])
    setFileWarnings([])
    setValidationResult(null)
    setPendingRestoreMode(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const showFeedback = useCallback((message) => {
    setFeedback(message)
  }, [])

  const handleExport = useCallback(() => {
    const snapshot = getCurrentBookloomSnapshot(books)
    const backup = createBackupPayload(snapshot)
    const serializedBackup = serializeBackup(backup)
    const didDownload = downloadBackupFile(serializedBackup, createBackupFilename())

    showFeedback(
      didDownload
        ? 'فایل پشتیبان Bookloom آماده شد.'
        : 'ساخت فایل پشتیبان انجام نشد. دوباره تلاش کن.',
    )
  }, [books, showFeedback])

  const restoreSnapshot = useCallback(
    (snapshot) => {
      replaceBooks(snapshot.books)
      saveReadingGoals(snapshot.readingGoals)
      saveCollectionPreferences(snapshot.collectionPreferences)
    },
    [replaceBooks],
  )

  const persistSnapshot = useCallback(
    (snapshot) => {
      const previousSnapshot = getCurrentBookloomSnapshot(books)
      const bookResult = replaceBooks(snapshot.books)

      if (!bookResult.success) {
        return false
      }

      const didSaveGoals = saveReadingGoals(snapshot.readingGoals)
      const didSavePreferences = saveCollectionPreferences(snapshot.collectionPreferences)

      if (!didSaveGoals || !didSavePreferences) {
        restoreSnapshot(previousSnapshot)
        return false
      }

      return true
    },
    [books, replaceBooks, restoreSnapshot],
  )

  const handleFileSelect = useCallback(async (event) => {
    const file = event.target.files?.[0]

    setFileName(file?.name ?? '')
    setFileErrors([])
    setFileWarnings([])
    setValidationResult(null)

    if (!file) {
      return
    }

    if (file.size > MAX_BACKUP_FILE_SIZE_BYTES) {
      setFileErrors(['اندازه فایل پشتیبان بیش از حد مجاز است.'])
      return
    }

    try {
      const content = await file.text()
      const parseResult = parseBackupFileContent(content)

      if (!parseResult.success) {
        setFileErrors([parseResult.error])
        return
      }

      const validation = validateBackupStructure(parseResult.parsed)

      setValidationResult(validation)
      setFileErrors(validation.errors)
      setFileWarnings(validation.warnings)
    } catch {
      setFileErrors(['خواندن فایل پشتیبان انجام نشد.'])
    }
  }, [])

  const handleRequestRestore = useCallback(() => {
    if (!validationResult?.valid) {
      return
    }

    setPendingRestoreMode(restoreMode)
  }, [restoreMode, validationResult])

  const handleConfirmRestore = useCallback(() => {
    if (!validationResult?.valid || !pendingRestoreMode) {
      return
    }

    setIsProcessing(true)

    const importedData = validationResult.normalizedBackup.data
    const targetSnapshot =
      pendingRestoreMode === RESTORE_MODE.REPLACE
        ? {
            ...importedData,
            books: resolveImportedBookDuplicates(importedData.books).books,
          }
        : createMergedBookloomData(currentSnapshot, importedData).data
    const didPersist = persistSnapshot(targetSnapshot)

    setIsProcessing(false)
    setPendingRestoreMode(null)

    if (!didPersist) {
      showFeedback('بازیابی اطلاعات انجام نشد و اطلاعات قبلی حفظ شد.')
      return
    }

    resetImportState()
    showFeedback(
      pendingRestoreMode === RESTORE_MODE.REPLACE
        ? 'اطلاعات Bookloom با فایل پشتیبان جایگزین شد.'
        : 'اطلاعات فایل پشتیبان با داده‌های فعلی ادغام شد.',
    )
  }, [
    currentSnapshot,
    pendingRestoreMode,
    persistSnapshot,
    resetImportState,
    showFeedback,
    validationResult,
  ])

  const handleReset = useCallback(() => {
    const previousSnapshot = getCurrentBookloomSnapshot(books)
    const didClearBooks = clearBooks()
    const didClearGoals = clearReadingGoals()
    const didClearPreferences = clearCollectionPreferences()
    const stateResult = replaceBooks([], { persist: false })

    if (!didClearBooks || !didClearGoals || !didClearPreferences || !stateResult.success) {
      restoreSnapshot(previousSnapshot)
      showFeedback('پاک کردن اطلاعات انجام نشد و اطلاعات قبلی حفظ شد.')
      return
    }

    resetImportState()
    showFeedback('اطلاعات Bookloom از این مرورگر پاک شد.')
  }, [books, replaceBooks, resetImportState, restoreSnapshot, showFeedback])

  const restoreTitle =
    pendingRestoreMode === RESTORE_MODE.REPLACE ? 'جایگزینی اطلاعات' : 'ادغام اطلاعات'
  const restoreMessage =
    pendingRestoreMode === RESTORE_MODE.REPLACE
      ? 'این کار اطلاعات فعلی Bookloom را با محتوای فایل پشتیبان جایگزین می‌کند. ادامه می‌دهی؟'
      : 'این کار اطلاعات فایل پشتیبان را با داده‌های فعلی ادغام می‌کند. ادامه می‌دهی؟'

  return (
    <section className="settings-page" aria-labelledby="settings-title">
      <div className="page-heading">
        <span className="page-kicker">پیکربندی</span>
        <h2 id="settings-title">تنظیمات</h2>
        <p>
          از داده‌های Bookloom فایل پشتیبان بگیر، اطلاعات قبلی را بازیابی کن، یا فقط داده‌های
          Bookloom را از همین مرورگر پاک کن.
        </p>
      </div>

      <BackupExportSection bookCount={currentSummary.bookCount} onExport={handleExport} />

      <BackupImportSection
        currentSummary={currentSummary}
        errors={fileErrors}
        fileInputRef={fileInputRef}
        fileName={fileName}
        mergePreview={mergePreview}
        restoreMode={restoreMode}
        validationResult={validationResult}
        warnings={[
          ...fileWarnings,
          ...(restoreMode === RESTORE_MODE.MERGE ? mergePreview?.warnings ?? [] : []),
        ]}
        onCancel={resetImportState}
        onFileSelect={handleFileSelect}
        onRequestRestore={handleRequestRestore}
        onRestoreModeChange={setRestoreMode}
      />

      <section className="settings-section" aria-labelledby="storage-summary-title">
        <div>
          <h2 id="storage-summary-title">خلاصه داده‌های فعلی</h2>
          <p>این بخش فقط داده‌هایی را نشان می‌دهد که در فایل پشتیبان Bookloom ذخیره می‌شوند.</p>
        </div>
        <dl className="settings-card backup-summary-grid">
          <div>
            <dt>کتاب‌ها</dt>
            <dd>{formatNumber(currentSummary.bookCount)}</dd>
          </div>
          <div>
            <dt>نقل‌قول‌ها</dt>
            <dd>{formatNumber(currentSummary.quoteCount)}</dd>
          </div>
          <div>
            <dt>سال‌های دارای هدف مطالعه</dt>
            <dd>{formatNumber(currentSummary.readingGoalYearCount)}</dd>
          </div>
          <div>
            <dt>تنظیمات نمایش</dt>
            <dd>{currentSummary.hasCollectionPreferences ? 'ذخیره شده' : 'ثبت نشده'}</dd>
          </div>
        </dl>
      </section>

      <ResetBookloomData onExport={handleExport} onReset={handleReset} />

      <ConfirmDialog
        confirmLabel={pendingRestoreMode === RESTORE_MODE.REPLACE ? 'جایگزین کن' : 'ادغام کن'}
        isConfirming={isProcessing}
        isOpen={Boolean(pendingRestoreMode)}
        message={restoreMessage}
        title={restoreTitle}
        onCancel={() => setPendingRestoreMode(null)}
        onConfirm={handleConfirmRestore}
      />

      <FeedbackMessage message={feedback} onDismiss={() => setFeedback('')} />
    </section>
  )
}

export default SettingsPage
