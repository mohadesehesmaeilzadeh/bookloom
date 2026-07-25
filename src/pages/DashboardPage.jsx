import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ProgressUpdateController from '../components/books/ProgressUpdateController'
import FeedbackMessage from '../components/common/FeedbackMessage'
import CategorySummary from '../components/dashboard/CategorySummary'
import ContinueReadingCard from '../components/dashboard/ContinueReadingCard'
import DailyQuoteCard from '../components/dashboard/DailyQuoteCard'
import MonthlyFinishedSummary from '../components/dashboard/MonthlyFinishedSummary'
import ReadingGoalCard from '../components/dashboard/ReadingGoalCard'
import ReadingGoalModal from '../components/dashboard/ReadingGoalModal'
import ReadingPagesSummary from '../components/dashboard/ReadingPagesSummary'
import RecentActivityList from '../components/dashboard/RecentActivityList'
import RecentBooksList from '../components/dashboard/RecentBooksList'
import StatisticCard from '../components/dashboard/StatisticCard'
import RecommendationEntryCard from '../components/recommendations/RecommendationEntryCard'
import { ROUTES } from '../constants/routes'
import { useBooksContext } from '../context/useBooksContext'
import { useReadingGoal } from '../hooks/useReadingGoal'
import {
  getAnnualGoalProgress,
  getBooksFinishedByMonth,
  getCategoryStatistics,
  getContinueReadingBook,
  getDashboardSummary,
  getReadingPagesSummary,
  getRecentActivity,
  getRecentBooks,
  getRecentFinishedBooks,
} from '../utils/dashboardStatistics'
import { getDailyBookQuote } from '../utils/bookQuotes'

function DashboardPage() {
  const { books } = useBooksContext()
  const currentYear = new Date().getFullYear()
  const { annualGoal, hasAnnualGoal, saveAnnualGoal, year } = useReadingGoal(currentYear)
  const [progressBook, setProgressBook] = useState(null)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const dismissFeedback = useCallback(() => setFeedback(''), [])
  const dashboardData = useMemo(
    () => ({
      categoryStatistics: getCategoryStatistics(books),
      continueReadingBook: getContinueReadingBook(books),
      monthlyFinished: getBooksFinishedByMonth(books, currentYear),
      pagesSummary: getReadingPagesSummary(books),
      recentActivity: getRecentActivity(books),
      recentBooks: getRecentBooks(books),
      recentFinishedBooks: getRecentFinishedBooks(books),
      dailyQuote: getDailyBookQuote(books),
      summary: getDashboardSummary(books),
    }),
    [books, currentYear],
  )
  const annualGoalProgress = useMemo(
    () => getAnnualGoalProgress(books, annualGoal, year),
    [annualGoal, books, year],
  )
  const hasBooks = books.length > 0
  const summaryCards = [
    {
      description: 'همه رکوردها، شامل کتابخانه و لیست خرید',
      link: ROUTES.LIBRARY,
      title: 'کل کتاب‌ها',
      value: dashboardData.summary.totalBooks,
    },
    {
      description: 'کتاب‌های متعلق به کتابخانه، بدون لیست خرید',
      link: ROUTES.LIBRARY,
      title: 'کتاب‌های کتابخانه',
      value: dashboardData.summary.libraryBooks,
    },
    {
      description:
        dashboardData.summary.pausedBooks > 0
          ? `${dashboardData.summary.pausedBooks.toLocaleString('fa-IR')} کتاب متوقف‌شده`
          : 'کتاب‌هایی که اکنون در حال خواندن هستند',
      link: ROUTES.READING,
      title: 'در حال مطالعه',
      value: dashboardData.summary.readingBooks,
    },
    {
      description: 'کتاب‌هایی که تاریخ پایان مطالعه دارند در آمار سالانه هم بررسی می‌شوند',
      link: ROUTES.FINISHED,
      title: 'تمام‌شده‌ها',
      value: dashboardData.summary.finishedBooks,
    },
    {
      description: 'کتاب‌هایی که هنوز خریداری نشده‌اند',
      link: ROUTES.WISHLIST,
      title: 'لیست خرید',
      value: dashboardData.summary.wishlistBooks,
    },
    {
      description: 'برآوردی از صفحات خوانده‌شده بر اساس وضعیت فعلی کتاب‌ها',
      title: 'مجموع صفحات خوانده‌شده',
      value: dashboardData.summary.totalReadPages,
    },
  ]

  function handleGoalSubmit(goal) {
    saveAnnualGoal(goal)
    setIsGoalModalOpen(false)
    setFeedback('هدف مطالعه سالانه ذخیره شد.')
  }

  return (
    <section className="dashboard-page" aria-labelledby="dashboard-title">
      <div className="dashboard-intro">
        <h2 id="dashboard-title">داشبورد Bookloom</h2>
        <p>
          نمایی فشرده از کتابخانه، پیشرفت مطالعه، هدف سالانه و فعالیت‌های اخیر بر اساس داده‌های
          ذخیره‌شده فعلی.
        </p>
      </div>

      {!hasBooks ? (
        <div className="empty-state dashboard-onboarding">
          <h3>هنوز کتابی در Bookloom ثبت نکرده‌ای.</h3>
          <p>اولین کتابت را به کتابخانه یا لیست خرید اضافه کن.</p>
          <div className="form-actions">
            <Link className="button button-primary" to={ROUTES.LIBRARY}>
              رفتن به کتابخانه
            </Link>
            <Link className="button button-secondary" to={ROUTES.WISHLIST}>
              رفتن به لیست خرید
            </Link>
          </div>
        </div>
      ) : null}

      <div className="dashboard-grid" aria-label="خلاصه وضعیت کتاب‌ها">
        {summaryCards.map((card) => (
          <StatisticCard
            description={card.description}
            key={card.title}
            link={card.link}
            title={card.title}
            value={card.value}
          />
        ))}
      </div>

      <FeedbackMessage message={feedback} onDismiss={dismissFeedback} />

      <section className="dashboard-section" aria-labelledby="continue-reading-title">
        <div className="library-header">
          <div>
            <h2 id="continue-reading-title">ادامه مطالعه</h2>
            <p>مناسب‌ترین کتاب برای ادامه بر اساس وضعیت و آخرین فعالیت مطالعه انتخاب می‌شود.</p>
          </div>
        </div>
        <ContinueReadingCard
          book={dashboardData.continueReadingBook}
          onUpdateProgress={setProgressBook}
        />
      </section>

      <section className="dashboard-section" aria-labelledby="annual-goal-title">
        <div className="library-header">
          <div>
            <h2 id="annual-goal-title">هدف مطالعه سالانه</h2>
            <p>فقط کتاب‌های تمام‌شده با تاریخ پایان معتبر در سال جاری شمرده می‌شوند.</p>
          </div>
        </div>
        <ReadingGoalCard
          hasGoal={hasAnnualGoal}
          progress={annualGoalProgress}
          onEdit={() => setIsGoalModalOpen(true)}
        />
      </section>

      <ReadingPagesSummary summary={dashboardData.pagesSummary} />
      <RecommendationEntryCard onFeedback={setFeedback} />
      <DailyQuoteCard quoteItem={dashboardData.dailyQuote} />
      <MonthlyFinishedSummary months={dashboardData.monthlyFinished} />
      <RecentActivityList activities={dashboardData.recentActivity} />

      <div className="dashboard-two-column">
        <RecentBooksList
          books={dashboardData.recentBooks}
          dateField="createdAt"
          emptyMessage="هنوز کتابی اضافه نشده است."
          title="کتاب‌های تازه اضافه‌شده"
        />
        <RecentBooksList
          books={dashboardData.recentFinishedBooks}
          dateField="readingEndDate"
          emptyMessage="هنوز کتاب تمام‌شده‌ای با تاریخ پایان معتبر ثبت نشده است."
          showPages
          title="کتاب‌های تازه تمام‌شده"
        />
      </div>

      <CategorySummary statistics={dashboardData.categoryStatistics} />

      <ReadingGoalModal
        goal={annualGoal}
        isOpen={isGoalModalOpen}
        year={year}
        onClose={() => setIsGoalModalOpen(false)}
        onSubmit={handleGoalSubmit}
      />

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
