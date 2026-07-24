import { Link } from 'react-router-dom'
import { useCallback, useState } from 'react'
import ProgressUpdateController from '../components/books/ProgressUpdateController'
import ReadingProgressBar from '../components/books/ReadingProgressBar'
import { BOOK_STATUS, getBookStatusLabel } from '../constants/bookStatuses'
import { getBookDetailsPath, ROUTES } from '../constants/routes'
import { useBooksContext } from '../context/useBooksContext'
import { formatDateTime } from '../utils/dateUtils'
import { getReadingBooks } from '../utils/bookSelectors'
import { getContinueReadingBook } from '../utils/readingProgress'
import FeedbackMessage from '../components/common/FeedbackMessage'

function formatCount(value) {
  return value.toLocaleString('fa-IR')
}

function DashboardPage() {
  const { books } = useBooksContext()
  const [progressBook, setProgressBook] = useState(null)
  const [feedback, setFeedback] = useState('')
  const dismissFeedback = useCallback(() => setFeedback(''), [])
  const continueReadingBook = getContinueReadingBook(getReadingBooks(books))
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

      <FeedbackMessage message={feedback} onDismiss={dismissFeedback} />

      <section className="continue-reading-section" aria-labelledby="continue-reading-title">
        <div className="library-header">
          <div>
            <h2 id="continue-reading-title">ادامه مطالعه</h2>
            <p>آخرین کتابی که برای ادامه مطالعه مناسب است.</p>
          </div>
        </div>

        {continueReadingBook ? (
          <article className="continue-reading-card">
            <div>
              <h3>{continueReadingBook.title}</h3>
              {continueReadingBook.author ? <p>{continueReadingBook.author}</p> : null}
              {continueReadingBook.status === BOOK_STATUS.PAUSED ? (
                <span className="book-priority">متوقف‌شده</span>
              ) : null}
            </div>
            <ReadingProgressBar
              currentPage={continueReadingBook.currentPage}
              showDetails
              totalPages={continueReadingBook.totalPages}
            />
            {continueReadingBook.lastProgressUpdate ? (
              <p className="progress-updated">
                آخرین به‌روزرسانی:{' '}
                {formatDateTime(continueReadingBook.lastProgressUpdate)}
              </p>
            ) : null}
            <div className="form-actions">
              <Link
                className="button button-secondary"
                to={getBookDetailsPath(continueReadingBook.id)}
              >
                مشاهده جزئیات
              </Link>
              <button
                className="button button-primary"
                type="button"
                onClick={() => setProgressBook(continueReadingBook)}
              >
                به‌روزرسانی پیشرفت
              </button>
            </div>
          </article>
        ) : (
          <div className="empty-state">
            <h3>در حال حاضر کتابی را مطالعه نمی‌کنی.</h3>
            <p>
              از{' '}
              <Link className="inline-link" to={ROUTES.LIBRARY}>
                کتابخانه
              </Link>{' '}
              یک کتاب را برای شروع انتخاب کن.
            </p>
          </div>
        )}
      </section>

      <ProgressUpdateController
        book={progressBook}
        isOpen={Boolean(progressBook)}
        onClose={() => setProgressBook(null)}
        onFinished={setFeedback}
        onProgressSaved={setFeedback}
      />
    </section>
  )
}

export default DashboardPage
