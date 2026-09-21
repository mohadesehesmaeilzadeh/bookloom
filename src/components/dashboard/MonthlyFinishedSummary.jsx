import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatNumber } from '../../utils/formatNumber'
import { usePreferences } from '../../context/usePreferences'

function MonthlyFinishedSummary({ months }) {
  const { language, t } = usePreferences()
  const monthFormatter = new Intl.DateTimeFormat(language.locale, { month: 'short' })
  const fullMonthFormatter = new Intl.DateTimeFormat(language.locale, { month: 'long' })
  const monthName = (month, formatter) => formatter.format(new Date(2024, month - 1, 1))
  const hasFinishedBooks = months.some((month) => month.count > 0)

  return (
    <section className="dashboard-section" aria-labelledby="monthly-summary-title">
      <div className="library-header">
        <div>
          <h2 id="monthly-summary-title">{t('dashboard.monthly.title')}</h2>
          <p>{t('dashboard.monthly.description')}</p>
        </div>
      </div>

      {hasFinishedBooks ? (
        <div className="monthly-summary">
          <div className="monthly-chart-scroll">
            <div className="monthly-chart" role="img" aria-label={t('dashboard.monthly.chartAria')}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={months} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} tickFormatter={(month) => monthName(month, monthFormatter)} tickLine={false} />
                  <YAxis allowDecimals={false} orientation={language.value === 'fa' ? 'right' : 'left'} width={32} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} tickFormatter={formatNumber} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                    formatter={(count) => [formatNumber(count), t('dashboard.monthly.countLabel')]}
                    labelFormatter={(month) => monthName(month, fullMonthFormatter)}
                  />
                  <Bar dataKey="count" fill="var(--color-accent)" maxBarSize={32} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <ul className="visually-hidden">
            {months.map((month) => (
              <li key={month.month}>
                {monthName(month.month, fullMonthFormatter)}: {t('dashboard.bookCount', { count: formatNumber(month.count) })}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="soft-empty-state">{t('dashboard.monthly.empty')}</p>
      )}
    </section>
  )
}

export default MonthlyFinishedSummary
