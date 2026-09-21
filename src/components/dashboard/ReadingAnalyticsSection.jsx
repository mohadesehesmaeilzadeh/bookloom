import { usePreferences } from '../../context/usePreferences'
import { formatNumber } from '../../utils/formatNumber'
import StatisticCard from './StatisticCard'

function formatReadingTime(durationMs, t) {
  const hours = Math.floor(durationMs / 3600000)
  const minutes = Math.floor((durationMs % 3600000) / 60000)

  if (hours === 0) {
    return t('dashboard.analytics.minutes', { count: formatNumber(minutes) })
  }

  if (minutes === 0) {
    return t('dashboard.analytics.hours', { count: formatNumber(hours) })
  }

  return t('dashboard.analytics.hoursMinutes', {
    hours: formatNumber(hours),
    minutes: formatNumber(minutes),
  })
}

function ReadingAnalyticsSection({ analytics }) {
  const { t } = usePreferences()
  const metrics = [
    { title: t('dashboard.analytics.thisMonth'), value: analytics.booksThisMonth },
    { title: t('dashboard.analytics.thisYear'), value: analytics.booksThisYear },
    { title: t('dashboard.analytics.pages'), value: analytics.totalPagesRead },
    { title: t('dashboard.analytics.time'), value: formatReadingTime(analytics.totalReadingTimeMs, t) },
    { title: t('dashboard.analytics.rating'), value: analytics.averageRating === null ? t('dashboard.analytics.notRated') : formatNumber(Number(analytics.averageRating.toFixed(1))) },
    { title: t('dashboard.analytics.category'), value: analytics.favoriteCategory ?? t('dashboard.analytics.noCategory') },
    { title: t('dashboard.analytics.streak'), value: t(analytics.currentStreak === 1 ? 'dashboard.analytics.day' : 'dashboard.analytics.days', { count: formatNumber(analytics.currentStreak) }) },
  ]

  return (
    <section className="dashboard-section" aria-labelledby="reading-analytics-title">
      <div className="library-header">
        <div>
          <h2 id="reading-analytics-title">{t('dashboard.analytics.title')}</h2>
        </div>
      </div>
      <div className="dashboard-analytics-grid">
        {metrics.map((metric) => (
          <StatisticCard key={metric.title} title={metric.title} value={metric.value} />
        ))}
      </div>
    </section>
  )
}

export default ReadingAnalyticsSection
