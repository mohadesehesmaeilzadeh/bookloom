import { useCallback, useMemo, useRef, useState } from 'react'
import AccentColorSelector from '../components/settings/AccentColorSelector'
import BackupExportSection from '../components/settings/BackupExportSection'
import BackupImportSection from '../components/settings/BackupImportSection'
import LanguageSelector from '../components/settings/LanguageSelector'
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
import { LANGUAGE } from '../i18n/localization'

function SettingsPage() {
  const { books, replaceBooks } = useBooksContext()
  const {
    preferences,
    language,
    replacePreferences,
    resetPreferences,
    t,
    updatePreference,
    updatePreferences,
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

    return createMergedBookloomData(currentSnapshot, validationResult.normalizedBackup.data, language.value)
  }, [currentSnapshot, language.value, validationResult])

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
        ? t('settings.saved')
        : t('settings.saveFailed'),
    )
  }, [showFeedback, t, updatePreference])

  const handleLanguageChange = useCallback((value) => {
    const result = updatePreferences({
      language: value,
      usePersianDigits: value === LANGUAGE.FA,
    })

    showFeedback(
      result.success
        ? t('settings.saved')
        : t('settings.saveFailed'),
    )
  }, [showFeedback, t, updatePreferences])

  const handleExport = useCallback(() => {
    const snapshot = getCurrentBookloomSnapshot(books, preferences)
    const backup = createBackupPayload(snapshot)
    const serializedBackup = serializeBackup(backup)
    const didDownload = downloadBackupFile(serializedBackup, createBackupFilename())

    showFeedback(
      didDownload
        ? t('settings.exportReady')
        : t('settings.exportFailed'),
    )
  }, [books, preferences, showFeedback, t])

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
      setFileErrors([t('settings.backupTooLarge')])
      return
    }

    try {
      const content = await file.text()
      const parseResult = parseBackupFileContent(content, language.value)

      if (!parseResult.success) {
        setFileErrors([parseResult.error])
        return
      }

      const validation = validateBackupStructure(parseResult.parsed, language.value)

      setValidationResult(validation)
      setFileErrors(validation.errors)
      setFileWarnings(validation.warnings)
    } catch {
      setFileErrors([t('settings.backupReadFailed')])
    }
  }, [language.value, t])

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
            books: resolveImportedBookDuplicates(importedData.books, language.value).books,
          }
        : createMergedBookloomData(currentSnapshot, importedData, language.value).data
    const didPersist = persistSnapshot(targetSnapshot)

    setIsProcessing(false)
    setPendingRestoreMode(null)

    if (!didPersist) {
      showFeedback(t('settings.restoreFailed'))
      return
    }

    resetImportState()
    showFeedback(
      pendingRestoreMode === RESTORE_MODE.REPLACE
        ? t('settings.restoreReplaceSuccess')
        : t('settings.restoreMergeSuccess'),
    )
  }, [
    currentSnapshot,
    language.value,
    pendingRestoreMode,
    persistSnapshot,
    resetImportState,
    showFeedback,
    t,
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
      showFeedback(t('settings.resetFailed'))
      return
    }

    resetImportState()
    showFeedback(t('settings.resetSuccess'))
  }, [
    books,
    preferences,
    replaceBooks,
    resetImportState,
    resetPreferences,
    restoreSnapshot,
    showFeedback,
    t,
  ])

  function handlePreferenceResetConfirm() {
    const result = resetPreferences()

    setIsPreferenceResetOpen(false)
    showFeedback(
      result.success
        ? t('settings.preferencesResetSuccess')
        : t('settings.preferencesResetFailed'),
    )
  }

  const restoreTitle =
    pendingRestoreMode === RESTORE_MODE.REPLACE
      ? t('settings.restoreReplaceTitle')
      : t('settings.restoreMergeTitle')
  const restoreMessage =
    pendingRestoreMode === RESTORE_MODE.REPLACE
      ? t('settings.restoreReplaceMessage')
      : t('settings.restoreMergeMessage')

  return (
    <section className="settings-page" aria-labelledby="settings-title">
      <div className="page-heading">
        <span className="page-kicker">{t('settings.pageKicker')}</span>
        <h2 id="settings-title">{t('settings.title')}</h2>
        <p>
          {t('settings.description')}
        </p>
      </div>

      <section className="settings-section" aria-labelledby="appearance-settings-title">
        <div>
          <h2 id="appearance-settings-title">{t('settings.appearanceTitle')}</h2>
          <p>{t('settings.appearanceDescription')}</p>
        </div>
        <div className="settings-card">
          <LanguageSelector
            selectedLanguage={preferences.language}
            onChange={handleLanguageChange}
          />
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
            description={t('settings.persianDigitsDescription')}
            label={t('settings.persianDigitsLabel')}
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
          <h2 id="behavior-settings-title">{t('settings.behaviorTitle')}</h2>
          <p>{t('settings.behaviorDescription')}</p>
        </div>
        <div className="settings-card">
          <PreferenceToggle
            checked={preferences.confirmBeforeDelete}
            description={t('settings.confirmDeleteDescription')}
            label={t('settings.confirmDeleteLabel')}
            onChange={(value) => handlePreferenceChange('confirmBeforeDelete', value)}
          />
          <button
            className="button button-secondary"
            type="button"
            onClick={() => setIsPreferenceResetOpen(true)}
          >
            {t('settings.resetPreferencesButton')}
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
          <h2 id="storage-summary-title">{t('settings.currentDataTitle')}</h2>
          <p>{t('settings.currentDataDescription')}</p>
        </div>
        <dl className="settings-card backup-summary-grid">
          <div>
            <dt>{t('settings.summary.books')}</dt>
            <dd>{formatNumber(currentSummary.bookCount)}</dd>
          </div>
          <div>
            <dt>{t('settings.summary.quotes')}</dt>
            <dd>{formatNumber(currentSummary.quoteCount)}</dd>
          </div>
          <div>
            <dt>{t('settings.summary.goalYears')}</dt>
            <dd>{formatNumber(currentSummary.readingGoalYearCount)}</dd>
          </div>
          <div>
            <dt>{t('settings.summary.preferences')}</dt>
            <dd>{currentSummary.hasCollectionPreferences ? t('common.saved') : t('common.notSet')}</dd>
          </div>
        </dl>
      </section>

      <ResetBookloomData onExport={handleExport} onReset={handleReset} />

      <ConfirmDialog
        confirmLabel={
          pendingRestoreMode === RESTORE_MODE.REPLACE
            ? t('settings.restoreReplaceConfirm')
            : t('settings.restoreMergeConfirm')
        }
        isConfirming={isProcessing}
        isOpen={Boolean(pendingRestoreMode)}
        message={restoreMessage}
        title={restoreTitle}
        onCancel={() => setPendingRestoreMode(null)}
        onConfirm={handleConfirmRestore}
      />

      <ConfirmDialog
        confirmLabel={t('settings.preferencesResetConfirm')}
        isOpen={isPreferenceResetOpen}
        message={t('settings.preferencesResetMessage')}
        title={t('settings.preferencesResetTitle')}
        onCancel={() => setIsPreferenceResetOpen(false)}
        onConfirm={handlePreferenceResetConfirm}
      />

      <FeedbackMessage message={feedback} onDismiss={() => setFeedback('')} />
    </section>
  )
}

export default SettingsPage
