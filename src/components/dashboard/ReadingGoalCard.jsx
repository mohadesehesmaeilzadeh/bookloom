import { formatNumber, formatPlainNumber } from '../../utils/formatNumber'
import { usePreferences } from '../../context/usePreferences'

function ReadingGoalCard({ hasGoal, progress, onEdit }) {
  const { t } = usePreferences()
  const progressLabel =
    progress.goal > 0
      ? t('dashboard.goal.percentage', { value: formatNumber(progress.progressBarPercentage) })
      : t('dashboard.goal.noPercentage')

  return (
    <article className="dashboard-panel reading-goal-card">
      <div className="dashboard-item-header">
        <div>
          <h3>{t('dashboard.annualGoalTitle')}</h3>
          {hasGoal ? (
            <p>{t('dashboard.goal.summary', {
              goal: formatNumber(progress.goal),
              year: formatPlainNumber(progress.year),
            })}</p>
          ) : (
            <p>{t('dashboard.goal.empty')}</p>
          )}
        </div>
        <button className="button button-secondary" type="button" onClick={onEdit}>
          {t('dashboard.goal.edit')}
        </button>
      </div>

      <div
        aria-label={t('dashboard.goal.progressAria', { progress: progressLabel })}
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
          <dt>{t('dashboard.goal.read')}</dt>
          <dd>{t('dashboard.bookCount', { count: formatNumber(progress.finishedThisYear) })}</dd>
        </div>
        <div>
          <dt>{t('dashboard.goal.remaining')}</dt>
          <dd>{t('dashboard.bookCount', { count: formatNumber(progress.remainingBooks) })}</dd>
        </div>
        <div>
          <dt>{t('dashboard.goal.progress')}</dt>
          <dd>{progress.goal > 0
            ? t('dashboard.goal.percentage', { value: formatNumber(progress.percentage) })
            : t('dashboard.goal.zero')}</dd>
        </div>
      </dl>
    </article>
  )
}

export default ReadingGoalCard
