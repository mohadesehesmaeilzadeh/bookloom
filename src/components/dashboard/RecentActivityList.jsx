import { Link } from 'react-router-dom'
import { getBookDetailsPath } from '../../constants/routes'
import { formatDateTime } from '../../utils/dateUtils'

function RecentActivityList({ activities }) {
  return (
    <section className="dashboard-section" aria-labelledby="recent-activity-title">
      <div className="library-header">
        <div>
          <h2 id="recent-activity-title">فعالیت‌های اخیر</h2>
          <p>این فهرست از داده‌های فعلی کتاب‌ها ساخته می‌شود، نه از یک تاریخچه جداگانه.</p>
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
                جزئیات
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <h3>هنوز فعالیت قابل نمایش وجود ندارد.</h3>
          <p>با افزودن، به‌روزرسانی یا تمام کردن کتاب‌ها این بخش پر می‌شود.</p>
        </div>
      )}
    </section>
  )
}

export default RecentActivityList
