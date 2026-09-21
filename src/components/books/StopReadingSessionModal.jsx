import { useEffect, useState } from 'react'
import Modal from '../common/Modal'
import { usePreferences } from '../../context/usePreferences'

function StopReadingSessionModal({ book, isOpen, onClose, onStop }) {
  const { t } = usePreferences()
  const [pagesRead, setPagesRead] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setPagesRead('')
      setError('')
    }
  }, [isOpen])

  function handleSubmit(event) {
    event.preventDefault()

    const pages = pagesRead.trim() === '' ? null : Number(pagesRead)

    if (pages !== null && (!Number.isInteger(pages) || pages < 0)) {
      setError(t('readingSessions.pagesInvalid'))
      return
    }

    if (pages !== null && book.totalPages > 0 && book.currentPage + pages > book.totalPages) {
      setError(t('readingSessions.pagesExceedTotal'))
      return
    }

    const result = onStop(pages)

    if (!result.success) {
      setError(t(`readingSessions.${result.reason ?? 'saveFailed'}`))
    }
  }

  return (
    <Modal isOpen={isOpen} title={t('readingSessions.stopTitle')} onClose={onClose}>
      <form className="book-form" noValidate onSubmit={handleSubmit}>
        <label className="form-field">
          <span>{t('readingSessions.pagesRead')}</span>
          <input
            aria-describedby={error ? 'session-pages-error' : undefined}
            aria-invalid={error ? 'true' : 'false'}
            min="0"
            step="1"
            type="number"
            value={pagesRead}
            onChange={(event) => {
              setPagesRead(event.target.value)
              setError('')
            }}
          />
        </label>
        <p className="muted-note">{t('readingSessions.pagesOptional')}</p>
        {error ? <p className="field-error" id="session-pages-error" role="alert">{error}</p> : null}
        <div className="form-actions">
          <button className="button button-secondary" type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="button button-primary" type="submit">
            {t('readingSessions.saveSession')}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default StopReadingSessionModal
