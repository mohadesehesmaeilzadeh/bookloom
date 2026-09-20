import { Link } from 'react-router-dom'
import { usePreferences } from '../../context/usePreferences'
import { formatNumber } from '../../utils/formatNumber'

function formatValue(value) {
  return typeof value === 'number' ? formatNumber(value) : value
}

function StatisticCard({ description, link, title, value }) {
  const { t } = usePreferences()
  const content = (
    <>
      <span>{title}</span>
      <strong>{formatValue(value)}</strong>
      {description ? <p>{description}</p> : null}
    </>
  )

  if (link) {
    return (
      <article className="summary-card statistic-card">
        {content}
        <Link className="inline-link" to={link}>
          {t('common.view')}
        </Link>
      </article>
    )
  }

  return <article className="summary-card statistic-card">{content}</article>
}

export default StatisticCard
