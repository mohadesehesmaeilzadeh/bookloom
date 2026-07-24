const dashboardCards = [
  {
    label: 'کل کتاب‌ها',
    value: '۰',
  },
  {
    label: 'در حال مطالعه',
    value: '۰',
  },
  {
    label: 'کتاب‌های تمام‌شده',
    value: '۰',
  },
  {
    label: 'لیست خرید',
    value: '۰',
  },
]

function DashboardPage() {
  return (
    <section className="dashboard-page" aria-labelledby="dashboard-title">
      <div className="dashboard-intro">
        <h2 id="dashboard-title">به بوک‌لوم خوش آمدید</h2>
        <p>
          اینجا نقطه شروع مدیریت کتاب‌های شخصی شماست. در فازهای بعدی، بخش‌های
          کتابخانه، مطالعه، خرید و آمار به‌تدریج اضافه می‌شوند.
        </p>
      </div>

      <div className="dashboard-grid" aria-label="خلاصه وضعیت کتاب‌ها">
        {dashboardCards.map((card) => (
          <article className="summary-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}

export default DashboardPage
