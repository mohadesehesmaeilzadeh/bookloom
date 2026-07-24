import { formatNumber } from '../../utils/formatNumber'

function ReadingPagesSummary({ summary }) {
  const metrics = [
    { label: 'صفحات کتاب‌های تمام‌شده', value: summary.pagesInFinishedBooks },
    { label: 'صفحات خوانده‌شده در کتاب‌های فعال', value: summary.activePagesRead },
    { label: 'صفحات کتاب‌های رهاشده', value: summary.abandonedPagesRead },
    { label: 'میانگین صفحات کتاب تمام‌شده', value: summary.averagePagesPerFinishedBook },
  ]

  return (
    <section className="dashboard-section" aria-labelledby="pages-summary-title">
      <div className="library-header">
        <div>
          <h2 id="pages-summary-title">خلاصه صفحات مطالعه</h2>
          <p>این اعداد از وضعیت فعلی کتاب‌ها محاسبه می‌شوند و تاریخچه روزانه نیستند.</p>
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
