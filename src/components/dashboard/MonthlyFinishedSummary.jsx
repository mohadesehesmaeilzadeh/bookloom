import { formatNumber } from '../../utils/formatNumber'

function MonthlyFinishedSummary({ months }) {
  const maxCount = Math.max(...months.map((month) => month.count), 0)

  return (
    <section className="dashboard-section" aria-labelledby="monthly-summary-title">
      <div className="library-header">
        <div>
          <h2 id="monthly-summary-title">کتاب‌های تمام‌شده در ماه‌های امسال</h2>
          <p>محاسبه بر اساس تاریخ پایان مطالعه و ماه‌های تقویم میلادی ذخیره‌شده انجام می‌شود.</p>
        </div>
      </div>

      <div className="monthly-summary">
        {months.map((month) => {
          const width = maxCount > 0 ? Math.max(8, (month.count / maxCount) * 100) : 0

          return (
            <div className="monthly-row" key={month.month}>
              <span>{month.label}</span>
              <div className="monthly-bar" aria-hidden="true">
                <span style={{ width: `${width}%` }} />
              </div>
              <strong>{formatNumber(month.count)} کتاب</strong>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default MonthlyFinishedSummary
