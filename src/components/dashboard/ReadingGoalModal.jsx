import { useEffect, useState } from 'react'
import { usePreferences } from '../../context/usePreferences'
import { formatPlainNumber } from '../../utils/formatNumber'
import Modal from '../common/Modal'

function validateGoal(value, t) {
  const number = Number(value)

  if (!Number.isInteger(number) || number < 0) {
    return t('dashboard.goal.validation')
  }

  return ''
}

function ReadingGoalModal({ goal, isOpen, onClose, onSubmit, year }) {
  const { t } = usePreferences()
  const [value, setValue] = useState(String(goal ?? 0))
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setValue(String(goal ?? 0))
      setError('')
    }
  }, [goal, isOpen])

  function handleSubmit(event) {
    event.preventDefault()

    const nextError = validateGoal(value, t)
    setError(nextError)

    if (nextError) {
      return
    }

    onSubmit(Number(value))
  }

  return (
    <Modal isOpen={isOpen} title={t('dashboard.annualGoalTitle')} onClose={onClose}>
      <form className="book-form" noValidate onSubmit={handleSubmit}>
        <label className="form-field">
          <span>{t('dashboard.goal.inputLabel', { year: formatPlainNumber(year) })}</span>
          <input
            aria-describedby={error ? 'annual-goal-error' : undefined}
            aria-invalid={error ? 'true' : 'false'}
            min="0"
            step="1"
            type="number"
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              if (error) {
                setError(validateGoal(event.target.value, t))
              }
            }}
          />
          {error ? (
            <p className="field-error" id="annual-goal-error">
              {error}
            </p>
          ) : null}
        </label>

        <div className="form-actions">
          <button className="button button-secondary" type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="button button-primary" type="submit">
            {t('dashboard.goal.save')}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ReadingGoalModal
