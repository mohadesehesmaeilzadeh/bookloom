import { BOOK_STATUS, getBookStatusLabel } from '../constants/bookStatuses'
import { useBooksContext } from '../context/useBooksContext'

function formatCount(value) {
  return value.toLocaleString('fa-IR')
}

function DashboardPage() {
  const { books } = useBooksContext()
  const dashboardCards = [
    {
      label: 'کل کتاب‌ها',
      value: books.length,
    },
    {
      label: getBookStatusLabel(BOOK_STATUS.READING),
      value: books.filter((book) => book.status === BOOK_STATUS.READING).length,
    },
    {
      label: `${getBookStatusLabel(BOOK_STATUS.FINISHED)}‌ها`,
      value: books.filter((book) => book.status === BOOK_STATUS.FINISHED).length,
    },
    {
      label: getBookStatusLabel(BOOK_STATUS.WISHLIST),
      value: books.filter((book) => book.status === BOOK_STATUS.WISHLIST).length,
    },
  ]

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
            <strong>{formatCount(card.value)}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}

export default DashboardPage
