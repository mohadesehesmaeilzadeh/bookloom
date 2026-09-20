import { formatNumber } from '../../utils/formatNumber'
import { usePreferences } from '../../context/usePreferences'

function BackupExportSection({ bookCount, onExport }) {
  const { t } = usePreferences()

  return (
    <section className="settings-section" aria-labelledby="backup-export-title">
      <div>
        <h2 id="backup-export-title">{t('backup.exportTitle')}</h2>
        <p>
          {t('backup.exportDescription')}
        </p>
      </div>
      <div className="settings-card">
        <p>{t('backup.exportCount', { count: formatNumber(bookCount) })}</p>
        <button className="button button-primary" type="button" onClick={onExport}>
          {t('backup.exportButton')}
        </button>
      </div>
    </section>
  )
}

export default BackupExportSection
