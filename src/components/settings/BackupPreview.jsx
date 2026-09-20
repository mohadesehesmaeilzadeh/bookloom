import { formatDateTime } from '../../utils/dateUtils'
import { formatNumber } from '../../utils/formatNumber'
import { usePreferences } from '../../context/usePreferences'

function BackupPreview({ backup, currentSummary, mergePreview, onCancel, onRestore, restoreMode }) {
  const { t } = usePreferences()
  const preview = backup.preview
  const rows = [
    [t('backup.exportedAt'), formatDateTime(backup.exportedAt)],
    [t('backup.schemaVersion'), formatNumber(backup.schemaVersion)],
    [t('settings.summary.books'), formatNumber(preview.bookCount)],
    [t('backup.wishlist'), formatNumber(preview.wishlistCount)],
    [t('backup.finished'), formatNumber(preview.finishedCount)],
    [t('settings.summary.quotes'), formatNumber(preview.quoteCount)],
    [t('settings.summary.goalYears'), formatNumber(preview.readingGoalYearCount)],
    [t('backup.hasPreferences'), preview.hasCollectionPreferences ? t('backup.exists') : t('backup.missing')],
  ]

  return (
    <div className="backup-preview">
      <h3>{t('backup.previewTitle')}</h3>
      <dl className="backup-summary-grid">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <div className="backup-comparison">
        <h4>{t('backup.compareTitle')}</h4>
        <dl className="backup-summary-grid">
          <div>
            <dt>{t('backup.currentBooks')}</dt>
            <dd>{formatNumber(currentSummary.bookCount)}</dd>
          </div>
          <div>
            <dt>{t('backup.fileBooks')}</dt>
            <dd>{formatNumber(preview.bookCount)}</dd>
          </div>
          <div>
            <dt>{t('backup.currentWishlist')}</dt>
            <dd>{formatNumber(currentSummary.wishlistCount)}</dd>
          </div>
          <div>
            <dt>{t('backup.fileWishlist')}</dt>
            <dd>{formatNumber(preview.wishlistCount)}</dd>
          </div>
          <div>
            <dt>{t('backup.currentFinished')}</dt>
            <dd>{formatNumber(currentSummary.finishedCount)}</dd>
          </div>
          <div>
            <dt>{t('backup.fileFinished')}</dt>
            <dd>{formatNumber(preview.finishedCount)}</dd>
          </div>
        </dl>
      </div>

      {restoreMode === 'merge' && mergePreview ? (
        <div className="merge-preview">
          <h4>{t('backup.mergePreviewTitle')}</h4>
          <dl className="backup-summary-grid">
            <div>
              <dt>{t('backup.mergeAdded')}</dt>
              <dd>{formatNumber(mergePreview.summary.books.added)}</dd>
            </div>
            <div>
              <dt>{t('backup.mergeUpdated')}</dt>
              <dd>{formatNumber(mergePreview.summary.books.updated)}</dd>
            </div>
            <div>
              <dt>{t('backup.mergeKeptLocal')}</dt>
              <dd>{formatNumber(mergePreview.summary.books.keptLocal)}</dd>
            </div>
            <div>
              <dt>{t('backup.mergeDuplicates')}</dt>
              <dd>{formatNumber(mergePreview.summary.books.duplicatesResolved)}</dd>
            </div>
          </dl>
        </div>
      ) : null}

      <div className="form-actions">
        <button className="button button-secondary" type="button" onClick={onCancel}>
          {t('common.cancel')}
        </button>
        <button className="button button-primary" type="button" onClick={onRestore}>
          {t('backup.continueRestore')}
        </button>
      </div>
    </div>
  )
}

export default BackupPreview
