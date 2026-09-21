import { lazy, Suspense, useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ProgressUpdateController from '../components/books/ProgressUpdateController'
import FeedbackMessage from '../components/common/FeedbackMessage'
import CategorySummary from '../components/dashboard/CategorySummary'
import ContinueReadingCard from '../components/dashboard/ContinueReadingCard'
import DailyQuoteCard from '../components/dashboard/DailyQuoteCard'
import ReadingGoalCard from '../components/dashboard/ReadingGoalCard'
import ReadingGoalModal from '../components/dashboard/ReadingGoalModal'
import ReadingPagesSummary from '../components/dashboard/ReadingPagesSummary'
import ReadingAnalyticsSection from '../components/dashboard/ReadingAnalyticsSection'
import RecentActivityList from '../components/dashboard/RecentActivityList'
import RecentBooksList from '../components/dashboard/RecentBooksList'
import StatisticCard from '../components/dashboard/StatisticCard'
import RecommendationEntryCard from '../components/recommendations/RecommendationEntryCard'
import { ROUTES } from '../constants/routes'
import { useBooksContext } from '../context/useBooksContext'
import { usePreferences } from '../context/usePreferences'
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
import { formatNumber } from '../utils/formatNumber'
import { getReadingAnalytics } from '../utils/readingAnalytics'

const MonthlyFinishedSummary = lazy(() => import('../components/dashboard/MonthlyFinishedSummary'))

function DashboardPage() {
  const { books } = useBooksContext()
  const { language, t } = usePreferences()
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
      readingAnalytics: getReadingAnalytics(books),
      recentActivity: getRecentActivity(books, 5, language.value),
      recentBooks: getRecentBooks(books),
      recentFinishedBooks: getRecentFinishedBooks(books),
      dailyQuote: getDailyBookQuote(books),
      summary: getDashboardSummary(books),
    }),
    [books, currentYear, language.value],
  )
  const annualGoalProgress = useMemo(
    () => getAnnualGoalProgress(books, annualGoal, year),
    [annualGoal, books, year],
  )
  const hasBooks = books.length > 0
  const summaryCards = [
    {
      description: t('dashboard.totalBooks.description'),
      link: ROUTES.LIBRARY,
      title: t('dashboard.totalBooks.title'),
      value: dashboardData.summary.totalBooks,
    },
    {
      description: t('dashboard.libraryBooks.description'),
      link: ROUTES.LIBRARY,
      title: t('dashboard.libraryBooks.title'),
      value: dashboardData.summary.libraryBooks,
    },
    {
      description:
        dashboardData.summary.pausedBooks > 0
          ? t('dashboard.pausedBooksDescription', {
              count: formatNumber(dashboardData.summary.pausedBooks),
            })
          : t('dashboard.readingBooks.description'),
      link: ROUTES.READING,
      title: t('dashboard.readingBooks.title'),
      value: dashboardData.summary.readingBooks,
    },
    {
      description: t('dashboard.finishedBooks.description'),
      link: ROUTES.FINISHED,
      title: t('dashboard.finishedBooks.title'),
      value: dashboardData.summary.finishedBooks,
    },
    {
      description: t('dashboard.wishlistBooks.description'),
      link: ROUTES.WISHLIST,
      title: t('dashboard.wishlistBooks.title'),
      value: dashboardData.summary.wishlistBooks,
    },
    {
      description: t('dashboard.totalReadPages.description'),
      title: t('dashboard.totalReadPages.title'),
      value: dashboardData.summary.totalReadPages,
    },
  ]

  function handleGoalSubmit(goal) {
    saveAnnualGoal(goal)
    setIsGoalModalOpen(false)
    setFeedback(t('dashboard.goalSaved'))
  }

  return (
    <section className="dashboard-page" aria-labelledby="dashboard-title">
      <div className="dashboard-intro">
        <h2 id="dashboard-title">{t('dashboard.title')}</h2>
        <p>
          {t('dashboard.description')}
        </p>
      </div>

      {!hasBooks ? (
        <div className="empty-state dashboard-onboarding">
          <h3>{t('dashboard.emptyTitle')}</h3>
          <p>{t('dashboard.emptyDescription')}</p>
          <div className="form-actions">
            <Link className="button button-primary" to={ROUTES.LIBRARY}>
              {t('dashboard.goLibrary')}
            </Link>
            <Link className="button button-secondary" to={ROUTES.WISHLIST}>
              {t('dashboard.goWishlist')}
            </Link>
          </div>
        </div>
      ) : null}

      <div className="dashboard-grid" aria-label={t('dashboard.summaryAria')}>
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

      <ReadingAnalyticsSection analytics={dashboardData.readingAnalytics} />

      <FeedbackMessage message={feedback} onDismiss={dismissFeedback} />

      <section className="dashboard-section" aria-labelledby="continue-reading-title">
        <div className="library-header">
          <div>
            <h2 id="continue-reading-title">{t('dashboard.continueReadingTitle')}</h2>
            <p>{t('dashboard.continueReadingDescription')}</p>
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
            <h2 id="annual-goal-title">{t('dashboard.annualGoalTitle')}</h2>
            <p>{t('dashboard.annualGoalDescription')}</p>
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
      <Suspense fallback={null}>
        <MonthlyFinishedSummary months={dashboardData.monthlyFinished} />
      </Suspense>
      <RecentActivityList activities={dashboardData.recentActivity} />

      <div className="dashboard-two-column">
        <RecentBooksList
          books={dashboardData.recentBooks}
          dateField="createdAt"
          emptyMessage={t('dashboard.recentAddedEmpty')}
          title={t('dashboard.recentAddedTitle')}
        />
        <RecentBooksList
          books={dashboardData.recentFinishedBooks}
          dateField="readingEndDate"
          emptyMessage={t('dashboard.recentFinishedEmpty')}
          showPages
          title={t('dashboard.recentFinishedTitle')}
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
