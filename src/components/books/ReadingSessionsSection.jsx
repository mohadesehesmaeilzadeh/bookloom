import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BOOK_STATUS } from '../../constants/bookStatuses'
import { getBookDetailsPath } from '../../constants/routes'
import { useBooksContext } from '../../context/useBooksContext'
import { usePreferences } from '../../context/usePreferences'
import { formatDateTime } from '../../utils/dateUtils'
import { formatNumber, formatPlainNumber } from '../../utils/formatNumber'
import { getActiveReadingBook, getReadingDurationParts } from '../../utils/readingSessions'
import StopReadingSessionModal from './StopReadingSessionModal'

function formatDuration(durationMs) {
  const { hours, minutes, seconds } = getReadingDurationParts(durationMs)
  const zero = formatPlainNumber(0)
  const twoDigits = (value) => formatPlainNumber(value).padStart(2, zero)

  return `${twoDigits(hours)}:${twoDigits(minutes)}:${twoDigits(seconds)}`
}

function ReadingSessionsSection({ book, onFeedback }) {
  const { books, startReadingSession, stopReadingSession } = useBooksContext()
  const { t } = usePreferences()
  const [now, setNow] = useState(Date.now)
  const [isStopOpen, setIsStopOpen] = useState(false)
  const [error, setError] = useState('')
  const isActive = Boolean(book.activeReadingSessionStartedAt)
  const activeBook = getActiveReadingBook(books)
  const otherActiveBook = activeBook?.id !== book.id ? activeBook : null
  const sessions = [...book.readingSessions].sort(
    (a, b) => Date.parse(b.endedAt) - Date.parse(a.endedAt),
  )
  const totalDuration = book.readingSessions.reduce(
    (total, session) => total + session.durationMs,
    0,
  )

  useEffect(() => {
    if (!isActive) {
      return undefined
    }

    const intervalId = window.setInterval(() => setNow(Date.now()), 1000)

    return () => window.clearInterval(intervalId)
  }, [isActive])

  function handleStart() {
    const result = startReadingSession(book.id)

    if (result.success) {
      setNow(Date.now())
      setError('')
      onFeedback(t('readingSessions.started'))
    } else {
      setError(t(`readingSessions.${result.reason}`))
    }
  }

  function handleStop(pagesRead) {
    const result = stopReadingSession(book.id, pagesRead)

    if (result.success) {
      setIsStopOpen(false)
      setError('')
      onFeedback(t('readingSessions.saved'))
    }

    return result
  }

  if (book.status !== BOOK_STATUS.READING && !isActive && sessions.length === 0) {
    return null
  }

  return (
    <section className="details-section reading-sessions" aria-labelledby="reading-sessions-title">
      <div className="dashboard-item-header">
        <div>
          <h3 id="reading-sessions-title">{t('readingSessions.title')}</h3>
          <p>{t('readingSessions.totalTime', { duration: formatDuration(totalDuration) })}</p>
        </div>
        {isActive ? (
          <button className="button button-primary" type="button" onClick={() => setIsStopOpen(true)}>
            {t('readingSessions.stop')}
          </button>
        ) : book.status === BOOK_STATUS.READING ? (
          <button className="button button-primary" disabled={Boolean(otherActiveBook)} type="button" onClick={handleStart}>
            {t('readingSessions.start')}
          </button>
        ) : null}
      </div>

      {isActive ? (
        <div className="reading-session-active">
          <strong>{formatDuration(now - Date.parse(book.activeReadingSessionStartedAt))}</strong>
          <span>{t('readingSessions.startedAt', { date: formatDateTime(book.activeReadingSessionStartedAt) })}</span>
        </div>
      ) : null}

      {otherActiveBook && !isActive ? (
        <p className="reading-session-notice">
          {t('readingSessions.activeElsewhere', { title: otherActiveBook.title })}{' '}
          <Link to={getBookDetailsPath(otherActiveBook.id)}>{t('readingSessions.viewActive')}</Link>
        </p>
      ) : null}
      {error ? <p className="field-error" role="alert">{error}</p> : null}

      {sessions.length > 0 ? (
        <div className="reading-session-history">
          <h4>{t('readingSessions.recent')}</h4>
          <ul>
            {sessions.slice(0, 5).map((session) => (
              <li key={session.id}>
                <span>{formatDateTime(session.startedAt)}</span>
                <strong>{formatDuration(session.durationMs)}</strong>
                {session.pagesRead !== null ? (
                  <span>{t('readingSessions.pages', { count: formatNumber(session.pagesRead) })}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : !isActive ? (
        <p className="soft-empty-state">{t('readingSessions.empty')}</p>
      ) : null}

      <StopReadingSessionModal
        book={book}
        isOpen={isStopOpen}
        onClose={() => setIsStopOpen(false)}
        onStop={handleStop}
      />
    </section>
  )
}

export default ReadingSessionsSection
