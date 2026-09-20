import { usePreferences } from '../context/usePreferences'

function StatisticsPage() {
  const { t } = usePreferences()

  return (
    <section className="placeholder-page" aria-labelledby="statistics-title">
      <h2 id="statistics-title">{t('statistics.title')}</h2>
      <p>{t('statistics.description')}</p>
    </section>
  )
}

export default StatisticsPage
