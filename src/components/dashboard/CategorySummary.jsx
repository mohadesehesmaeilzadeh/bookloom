import { formatNumber } from '../../utils/formatNumber'
import { usePreferences } from '../../context/usePreferences'

function CategorySummary({ statistics }) {
  const { t } = usePreferences()

  return (
    <section className="dashboard-section" aria-labelledby="category-summary-title">
      <div className="library-header">
        <div>
          <h2 id="category-summary-title">{t('dashboard.categories.title')}</h2>
          <p>{t('dashboard.categories.description')}</p>
        </div>
      </div>

      {statistics.topCategories.length > 0 ? (
        <div className="dashboard-panel category-summary">
          <dl className="dashboard-inline-metrics">
            <div>
              <dt>{t('dashboard.categories.libraryCommon')}</dt>
              <dd>{statistics.mostCommonCategory?.name ?? t('common.unknown')}</dd>
            </div>
            <div>
              <dt>{t('dashboard.categories.finishedCommon')}</dt>
              <dd>{statistics.mostCommonFinishedCategory?.name ?? t('common.unknown')}</dd>
            </div>
          </dl>

          <ul className="category-list">
            {statistics.topCategories.map((category) => (
              <li key={category.name}>
                <span>{category.name}</span>
                <strong>
                  {t('dashboard.categories.counts', {
                    finished: formatNumber(category.finishedCount),
                    total: formatNumber(category.totalCount),
                  })}
                </strong>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="empty-state">
          <h3>{t('dashboard.categories.emptyTitle')}</h3>
          <p>{t('dashboard.categories.emptyDescription')}</p>
        </div>
      )}
    </section>
  )
}

export default CategorySummary
