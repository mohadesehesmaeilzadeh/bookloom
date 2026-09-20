import { formatNumber } from '../../utils/formatNumber'
import { usePreferences } from '../../context/usePreferences'

function ReadingPagesSummary({ summary }) {
  const { t } = usePreferences()
  const metrics = [
    { label: t('dashboard.pages.finished'), value: summary.pagesInFinishedBooks },
    { label: t('dashboard.pages.active'), value: summary.activePagesRead },
    { label: t('dashboard.pages.abandoned'), value: summary.abandonedPagesRead },
    { label: t('dashboard.pages.average'), value: summary.averagePagesPerFinishedBook },
  ]

  return (
    <section className="dashboard-section" aria-labelledby="pages-summary-title">
      <div className="library-header">
        <div>
          <h2 id="pages-summary-title">{t('dashboard.pages.title')}</h2>
          <p>{t('dashboard.pages.description')}</p>
        </div>
      </div>

      <div className="dashboard-metric-grid">
        {metrics.map((metric) => (
          <article className="dashboard-panel compact-panel" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{formatNumber(metric.value)}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ReadingPagesSummary
