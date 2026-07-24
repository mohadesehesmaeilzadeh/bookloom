import { useEffect, useState } from 'react'
import { formatPlainNumber } from '../../utils/formatNumber'
import Modal from '../common/Modal'

function validateGoal(value) {
  const number = Number(value)

  if (!Number.isInteger(number) || number < 0) {
    return 'تعداد هدف باید یک عدد صحیح و غیرمنفی باشد.'
  }

  return ''
}

function ReadingGoalModal({ goal, isOpen, onClose, onSubmit, year }) {
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

    const nextError = validateGoal(value)
    setError(nextError)

    if (nextError) {
      return
    }

    onSubmit(Number(value))
  }

  return (
    <Modal isOpen={isOpen} title="هدف مطالعه سالانه" onClose={onClose}>
      <form className="book-form" noValidate onSubmit={handleSubmit}>
        <label className="form-field">
          <span>تعداد کتاب هدف برای سال {formatPlainNumber(year)}</span>
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
                setError(validateGoal(event.target.value))
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
            انصراف
          </button>
          <button className="button button-primary" type="submit">
            ذخیره هدف
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ReadingGoalModal
