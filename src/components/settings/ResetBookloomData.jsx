import { useState } from 'react'
import Modal from '../common/Modal'
import { usePreferences } from '../../context/usePreferences'

function ResetBookloomData({ onExport, onReset }) {
  const { t } = usePreferences()
  const [isOpen, setIsOpen] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const confirmationPhrase = t('reset.confirmPhrase')
  const canReset = confirmationText.trim() === confirmationPhrase

  function closeModal() {
    setConfirmationText('')
    setIsOpen(false)
  }

  return (
    <section className="settings-section destructive-section" aria-labelledby="reset-data-title">
      <div>
        <h2 id="reset-data-title">{t('reset.title')}</h2>
        <p>{t('reset.description')}</p>
      </div>
      <div className="settings-card">
        <button className="button button-danger-soft" type="button" onClick={() => setIsOpen(true)}>
          {t('reset.openButton')}
        </button>
      </div>

      <Modal isOpen={isOpen} title={t('reset.modalTitle')} onClose={closeModal}>
        <div className="confirm-dialog reset-dialog">
          <p>{t('reset.backupSuggestion')}</p>
          <button className="button button-secondary" type="button" onClick={onExport}>
            {t('reset.backupFirst')}
          </button>
          <label className="form-field">
            <span>{t('reset.confirmInstruction', { phrase: confirmationPhrase })}</span>
            <input
              value={confirmationText}
              onChange={(event) => setConfirmationText(event.target.value)}
            />
          </label>
          <div className="form-actions">
            <button className="button button-secondary" type="button" onClick={closeModal}>
              {t('common.cancel')}
            </button>
            <button
              className="button button-danger"
              disabled={!canReset}
              type="button"
              onClick={() => {
                onReset()
                closeModal()
              }}
            >
              {t('reset.confirmButton')}
            </button>
          </div>
        </div>
      </Modal>
    </section>
  )
}

export default ResetBookloomData
