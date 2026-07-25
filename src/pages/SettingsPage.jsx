import { useCallback, useMemo, useRef, useState } from 'react'
import AccentColorSelector from '../components/settings/AccentColorSelector'
import BackupExportSection from '../components/settings/BackupExportSection'
import BackupImportSection from '../components/settings/BackupImportSection'
import PreferenceToggle from '../components/settings/PreferenceToggle'
import ResetBookloomData from '../components/settings/ResetBookloomData'
import StartPageSelector from '../components/settings/StartPageSelector'
import ThemeSelector from '../components/settings/ThemeSelector'
import ConfirmDialog from '../components/common/ConfirmDialog'
import FeedbackMessage from '../components/common/FeedbackMessage'
import { MAX_BACKUP_FILE_SIZE_BYTES } from '../constants/backupSchema'
import { RESTORE_MODE } from '../constants/restoreModes'
import { useBooksContext } from '../context/useBooksContext'
import { usePreferences } from '../context/usePreferences'
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
import { formatNumber } from '../utils/formatNumber'
import { clearPreferences } from '../utils/preferenceStorage'
import { clearReadingGoals, saveReadingGoals } from '../utils/readingGoalStorage'

function SettingsPage() {
  const { books, replaceBooks } = useBooksContext()
  const {
    preferences,
    replacePreferences,
    resetPreferences,
    updatePreference,
  } = usePreferences()
  const fileInputRef = useRef(null)
  const [feedback, setFeedback] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileErrors, setFileErrors] = useState([])
  const [fileWarnings, setFileWarnings] = useState([])
  const [validationResult, setValidationResult] = useState(null)
  const [restoreMode, setRestoreMode] = useState(RESTORE_MODE.MERGE)
  const [pendingRestoreMode, setPendingRestoreMode] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPreferenceResetOpen, setIsPreferenceResetOpen] = useState(false)

  const currentSnapshot = useMemo(
    () => getCurrentBookloomSnapshot(books, preferences),
    [books, preferences],
  )
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

  const handlePreferenceChange = useCallback((key, value) => {
    const result = updatePreference(key, value)
    showFeedback(
      result.success
        ? 'تنظیمات ذخیره شد.'
        : 'ذخیره تنظیمات انجام نشد.',
    )
  }, [showFeedback, updatePreference])

  const handleExport = useCallback(() => {
    const snapshot = getCurrentBookloomSnapshot(books, preferences)
    const backup = createBackupPayload(snapshot)
    const serializedBackup = serializeBackup(backup)
    const didDownload = downloadBackupFile(serializedBackup, createBackupFilename())

    showFeedback(
      didDownload
        ? 'فایل پشتیبان Bookloom آماده شد.'
        : 'ساخت فایل پشتیبان انجام نشد. دوباره تلاش کن.',
    )
  }, [books, preferences, showFeedback])

  const restoreSnapshot = useCallback(
    (snapshot) => {
      replaceBooks(snapshot.books)
      saveReadingGoals(snapshot.readingGoals)
      replacePreferences(snapshot.preferences)
    },
    [replaceBooks, replacePreferences],
  )

  const persistSnapshot = useCallback(
    (snapshot) => {
      const previousSnapshot = getCurrentBookloomSnapshot(books, preferences)
      const bookResult = replaceBooks(snapshot.books)

      if (!bookResult.success) {
        return false
      }

      const didSaveGoals = saveReadingGoals(snapshot.readingGoals)
      const preferenceResult = replacePreferences(snapshot.preferences)

      if (!didSaveGoals || !preferenceResult.success) {
        restoreSnapshot(previousSnapshot)
        return false
      }

      return true
    },
    [books, preferences, replaceBooks, replacePreferences, restoreSnapshot],
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
    const previousSnapshot = getCurrentBookloomSnapshot(books, preferences)
    const didClearBooks = clearBooks()
    const didClearGoals = clearReadingGoals()
    const didClearPreferences = clearPreferences()
    const stateResult = replaceBooks([], { persist: false })
    const preferenceResult = resetPreferences({ persist: false })

    if (
      !didClearBooks ||
      !didClearGoals ||
      !didClearPreferences ||
      !stateResult.success ||
      !preferenceResult.success
    ) {
      restoreSnapshot(previousSnapshot)
      showFeedback('پاک کردن اطلاعات انجام نشد و اطلاعات قبلی حفظ شد.')
      return
    }

    resetImportState()
    showFeedback('اطلاعات Bookloom از این مرورگر پاک شد.')
  }, [
    books,
    preferences,
    replaceBooks,
    resetImportState,
    resetPreferences,
    restoreSnapshot,
    showFeedback,
  ])

  function handlePreferenceResetConfirm() {
    const result = resetPreferences()

    setIsPreferenceResetOpen(false)
    showFeedback(
      result.success
        ? 'تنظیمات Bookloom به حالت پیش‌فرض بازگردانده شد.'
        : 'بازگرداندن تنظیمات انجام نشد.',
    )
  }

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
          ظاهر، رفتار، فایل‌های پشتیبان و داده‌های Bookloom را از این بخش مدیریت کن.
        </p>
      </div>

      <section className="settings-section" aria-labelledby="appearance-settings-title">
        <div>
          <h2 id="appearance-settings-title">ظاهر و نمایش</h2>
          <p>تم، رنگ اصلی، رقم‌های نمایشی و صفحه شروع برنامه را تنظیم کن.</p>
        </div>
        <div className="settings-card">
          <ThemeSelector
            selectedTheme={preferences.theme}
            onChange={(value) => handlePreferenceChange('theme', value)}
          />
          <AccentColorSelector
            selectedAccentColor={preferences.accentColor}
            onChange={(value) => handlePreferenceChange('accentColor', value)}
          />
          <PreferenceToggle
            checked={preferences.usePersianDigits}
            description="عددهای نمایشی مانند تعداد صفحات، قیمت‌ها و آمار با رقم‌های فارسی نمایش داده شوند."
            label="نمایش اعداد با رقم‌های فارسی"
            onChange={(value) => handlePreferenceChange('usePersianDigits', value)}
          />
          <StartPageSelector
            selectedStartPage={preferences.defaultStartPage}
            onChange={(value) => handlePreferenceChange('defaultStartPage', value)}
          />
        </div>
      </section>

      <section className="settings-section" aria-labelledby="behavior-settings-title">
        <div>
          <h2 id="behavior-settings-title">رفتار برنامه</h2>
          <p>تنظیمات رفتاری Bookloom را بدون تغییر کتاب‌ها مدیریت کن.</p>
        </div>
        <div className="settings-card">
          <PreferenceToggle
            checked={preferences.confirmBeforeDelete}
            description="پیش از حذف کتاب یا نقل‌قول، پیام تأیید نمایش داده شود."
            label="تأیید قبل از حذف"
            onChange={(value) => handlePreferenceChange('confirmBeforeDelete', value)}
          />
          <button
            className="button button-secondary"
            type="button"
            onClick={() => setIsPreferenceResetOpen(true)}
          >
            بازگرداندن تنظیمات به حالت پیش‌فرض
          </button>
        </div>
      </section>

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
          <p>این بخش داده‌هایی را نشان می‌دهد که در فایل پشتیبان Bookloom ذخیره می‌شوند.</p>
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
            <dt>تنظیمات برنامه</dt>
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

      <ConfirmDialog
        confirmLabel="بازگرداندن تنظیمات"
        isOpen={isPreferenceResetOpen}
        message="تنظیمات ظاهری، رفتاری و حالت نمایش فهرست‌ها به مقدار پیش‌فرض برمی‌گردد. کتاب‌ها، یادداشت‌ها، نقل‌قول‌ها و اهداف مطالعه حذف نمی‌شوند."
        title="بازگرداندن تنظیمات پیش‌فرض"
        onCancel={() => setIsPreferenceResetOpen(false)}
        onConfirm={handlePreferenceResetConfirm}
      />

      <FeedbackMessage message={feedback} onDismiss={() => setFeedback('')} />
    </section>
  )
}

export default SettingsPage
