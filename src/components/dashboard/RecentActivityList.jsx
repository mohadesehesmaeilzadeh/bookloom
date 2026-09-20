import { Link } from 'react-router-dom'
import { getBookDetailsPath } from '../../constants/routes'
import { usePreferences } from '../../context/usePreferences'
import { formatDateTime } from '../../utils/dateUtils'

function RecentActivityList({ activities }) {
  const { t } = usePreferences()

  return (
    <section className="dashboard-section" aria-labelledby="recent-activity-title">
      <div className="library-header">
        <div>
          <h2 id="recent-activity-title">{t('dashboard.activity.title')}</h2>
          <p>{t('dashboard.activity.description')}</p>
        </div>
      </div>

      {activities.length > 0 ? (
        <ul className="dashboard-list">
          {activities.map((activity) => (
            <li className="dashboard-list-item" key={activity.id}>
              <div>
                <p>{activity.label}</p>
                <span>{formatDateTime(activity.timestamp)}</span>
              </div>
              <Link className="inline-link" to={getBookDetailsPath(activity.book.id)}>
                {t('common.details')}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <h3>{t('dashboard.activity.emptyTitle')}</h3>
          <p>{t('dashboard.activity.emptyDescription')}</p>
        </div>
      )}
    </section>
  )
}

export default RecentActivityList
