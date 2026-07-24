import { BOOK_STATUS, getBookStatusLabel } from '../constants/bookStatuses'
import { useBooksContext } from '../context/useBooksContext'

function formatCount(value) {
  return value.toLocaleString('fa-IR')
}

function DashboardPage() {
  const { books, addBook, updateBook, deleteBook } = useBooksContext()
  const firstBook = books[0] ?? null
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

  function handleAddTestBook() {
    addBook({
      title: `کتاب آزمایشی ${formatCount(books.length + 1)}`,
      author: 'نویسنده آزمایشی',
      category: 'آزمایشی',
      status: BOOK_STATUS.OWNED,
    })
  }

  function handleUpdateFirstBook() {
    if (!firstBook) {
      return
    }

    updateBook(firstBook.id, {
      title: `${firstBook.title || 'کتاب بدون عنوان'} (ویرایش آزمایشی)`,
    })
  }

  function handleDeleteFirstBook() {
    if (!firstBook) {
      return
    }

    deleteBook(firstBook.id)
  }

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

      {import.meta.env.DEV ? (
        <section
          aria-label="ابزار توسعه کتاب‌ها"
          style={{
            display: 'grid',
            gap: 'var(--space-4)',
            padding: 'var(--space-5)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface-soft)',
          }}
        >
          <h3
            style={{
              margin: 0,
              color: 'var(--color-text)',
              fontSize: '1rem',
            }}
          >
            ابزار توسعه داده کتاب‌ها
          </h3>
          <p
            style={{
              margin: 0,
              color: 'var(--color-text-muted)',
              fontSize: '0.9rem',
            }}
          >
            اولین کتاب:{' '}
            <strong style={{ color: 'var(--color-text)' }}>
              {firstBook?.title || 'کتابی ثبت نشده است'}
            </strong>
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-3)',
            }}
          >
            <button type="button" onClick={handleAddTestBook} style={testButtonStyle}>
              افزودن کتاب آزمایشی
            </button>
            <button
              type="button"
              onClick={handleUpdateFirstBook}
              disabled={!firstBook}
              style={firstBook ? testButtonStyle : disabledTestButtonStyle}
            >
              ویرایش اولین کتاب
            </button>
            <button
              type="button"
              onClick={handleDeleteFirstBook}
              disabled={!firstBook}
              style={firstBook ? testButtonStyle : disabledTestButtonStyle}
            >
              حذف اولین کتاب
            </button>
          </div>
        </section>
      ) : null}
    </section>
  )
}

export default DashboardPage

const testButtonStyle = {
  minHeight: '40px',
  padding: 'var(--space-2) var(--space-4)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--color-text)',
  background: 'var(--color-surface)',
  cursor: 'pointer',
}

const disabledTestButtonStyle = {
  ...testButtonStyle,
  color: 'var(--color-text-muted)',
  cursor: 'not-allowed',
  opacity: 0.58,
}
