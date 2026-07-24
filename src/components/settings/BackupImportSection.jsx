import { MAX_BACKUP_FILE_SIZE_BYTES } from '../../constants/backupSchema'
import BackupPreview from './BackupPreview'
import RestoreModeSelector from './RestoreModeSelector'

function BackupImportSection({
  currentSummary,
  errors,
  fileName,
  fileInputRef,
  mergePreview,
  onCancel,
  onFileSelect,
  onRequestRestore,
  onRestoreModeChange,
  restoreMode,
  validationResult,
  warnings,
}) {
  return (
    <section className="settings-section" aria-labelledby="backup-import-title">
      <div>
        <h2 id="backup-import-title">بازیابی اطلاعات</h2>
        <p>فایل JSON پشتیبان را انتخاب کن، پیش‌نمایش را ببین و سپس روش بازیابی را تأیید کن.</p>
      </div>

      <div className="settings-card">
        <label className="form-field">
          <span>انتخاب فایل پشتیبان</span>
          <input
            accept=".json,application/json"
            ref={fileInputRef}
            type="file"
            onChange={onFileSelect}
          />
        </label>
        <p className="muted-note">
          حداکثر اندازه فایل: {Math.floor(MAX_BACKUP_FILE_SIZE_BYTES / 1024 / 1024)} مگابایت
        </p>
        {fileName ? <p className="selected-file-name">{fileName}</p> : null}

        {errors.length > 0 ? (
          <div className="validation-messages validation-errors" role="alert">
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        ) : null}

        {warnings.length > 0 ? (
          <div className="validation-messages validation-warnings">
            {warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
        ) : null}

        {validationResult?.valid ? (
          <>
            <RestoreModeSelector restoreMode={restoreMode} onChange={onRestoreModeChange} />
            <BackupPreview
              backup={validationResult.normalizedBackup}
              currentSummary={currentSummary}
              mergePreview={mergePreview}
              restoreMode={restoreMode}
              onCancel={onCancel}
              onRestore={onRequestRestore}
            />
          </>
        ) : null}
      </div>
    </section>
  )
}

export default BackupImportSection
