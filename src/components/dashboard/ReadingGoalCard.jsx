import { formatNumber, formatPlainNumber } from '../../utils/formatNumber'

function ReadingGoalCard({ hasGoal, progress, onEdit }) {
  const progressLabel =
    progress.goal > 0
      ? `${formatNumber(progress.progressBarPercentage)}٪`
      : 'بدون درصد'

  return (
    <article className="dashboard-panel reading-goal-card">
      <div className="dashboard-item-header">
        <div>
          <h3>هدف مطالعه سالانه</h3>
          {hasGoal ? (
            <p>هدف سال {formatPlainNumber(progress.year)}: {formatNumber(progress.goal)} کتاب</p>
          ) : (
            <p>هنوز برای امسال هدف مطالعه تعیین نکرده‌ای.</p>
          )}
        </div>
        <button className="button button-secondary" type="button" onClick={onEdit}>
          ویرایش هدف
        </button>
      </div>

      <div
        aria-label={`پیشرفت هدف مطالعه سالانه ${progressLabel}`}
        aria-valuemax="100"
        aria-valuemin="0"
        aria-valuenow={progress.progressBarPercentage}
        className="goal-progress-track"
        role="progressbar"
      >
        <span style={{ width: `${progress.progressBarPercentage}%` }} />
      </div>

      <dl className="dashboard-inline-metrics">
        <div>
          <dt>خوانده‌شده</dt>
          <dd>{formatNumber(progress.finishedThisYear)} کتاب</dd>
        </div>
        <div>
          <dt>باقی‌مانده</dt>
          <dd>{formatNumber(progress.remainingBooks)} کتاب</dd>
        </div>
        <div>
          <dt>پیشرفت</dt>
          <dd>{progress.goal > 0 ? `${formatNumber(progress.percentage)}٪` : 'هدف صفر است'}</dd>
        </div>
      </dl>
    </article>
  )
}

export default ReadingGoalCard
