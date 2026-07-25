import { formatNumber } from '../../utils/formatNumber'

function CategorySummary({ statistics }) {
  return (
    <section className="dashboard-section" aria-labelledby="category-summary-title">
      <div className="library-header">
        <div>
          <h2 id="category-summary-title">دسته‌بندی‌های مطالعه</h2>
          <p>دسته‌بندی‌ها از کتاب‌های موجود در کتابخانه محاسبه می‌شوند و لیست خرید را شامل نمی‌شوند.</p>
        </div>
      </div>

      {statistics.topCategories.length > 0 ? (
        <div className="dashboard-panel category-summary">
          <dl className="dashboard-inline-metrics">
            <div>
              <dt>رایج‌ترین دسته کتابخانه</dt>
              <dd>{statistics.mostCommonCategory?.name ?? 'نامشخص'}</dd>
            </div>
            <div>
              <dt>رایج‌ترین دسته تمام‌شده</dt>
              <dd>{statistics.mostCommonFinishedCategory?.name ?? 'نامشخص'}</dd>
            </div>
          </dl>

          <ul className="category-list">
            {statistics.topCategories.map((category) => (
              <li key={category.name}>
                <span>{category.name}</span>
                <strong>
                  {formatNumber(category.totalCount)} کتاب · {formatNumber(category.finishedCount)} تمام‌شده
                </strong>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="empty-state">
          <h3>هنوز دسته‌بندی قابل محاسبه وجود ندارد.</h3>
          <p>با ثبت دسته‌بندی برای کتاب‌های کتابخانه، این بخش کامل می‌شود.</p>
        </div>
      )}
    </section>
  )
}

export default CategorySummary
