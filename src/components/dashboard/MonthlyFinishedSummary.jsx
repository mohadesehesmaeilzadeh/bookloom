import { formatNumber } from '../../utils/formatNumber'
import { usePreferences } from '../../context/usePreferences'

function MonthlyFinishedSummary({ months }) {
  const { language, t } = usePreferences()
  const maxCount = Math.max(...months.map((month) => month.count), 0)
  const monthFormatter = new Intl.DateTimeFormat(language.locale, { month: 'long' })

  return (
    <section className="dashboard-section" aria-labelledby="monthly-summary-title">
      <div className="library-header">
        <div>
          <h2 id="monthly-summary-title">{t('dashboard.monthly.title')}</h2>
          <p>{t('dashboard.monthly.description')}</p>
        </div>
      </div>

      <div className="monthly-summary">
        {months.map((month) => {
          const width = maxCount > 0 ? Math.max(8, (month.count / maxCount) * 100) : 0

          return (
            <div className="monthly-row" key={month.month}>
              <span>{monthFormatter.format(new Date(2024, month.month - 1, 1))}</span>
              <div className="monthly-bar" aria-hidden="true">
                <span style={{ width: `${width}%` }} />
              </div>
              <strong>{t('dashboard.bookCount', { count: formatNumber(month.count) })}</strong>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default MonthlyFinishedSummary
