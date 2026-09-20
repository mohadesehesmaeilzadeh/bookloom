import { useEffect, useState } from 'react'
import Modal from '../common/Modal'
import { usePreferences } from '../../context/usePreferences'
import { t } from '../../i18n/localization'

function getInitialValues(book) {
  return {
    currentPage: book?.currentPage > 0 ? String(book.currentPage) : '',
    totalPages: book?.totalPages > 0 ? String(book.totalPages) : '',
  }
}

function validate(values, language) {
  const errors = {}
  const currentPage = values.currentPage === '' ? 0 : Number(values.currentPage)
  const totalPages = values.totalPages === '' ? 0 : Number(values.totalPages)

  if (!Number.isFinite(currentPage)) {
    errors.currentPage = t('validation.progress.valueInvalid', undefined, language)
  } else if (currentPage < 0) {
    errors.currentPage = t('validation.progress.currentNonNegative', undefined, language)
  }

  if (!Number.isFinite(totalPages)) {
    errors.totalPages = t('validation.progress.valueInvalid', undefined, language)
  } else if (totalPages < 0) {
    errors.totalPages = t('validation.progress.totalNonNegative', undefined, language)
  }

  if (
    !errors.currentPage &&
    !errors.totalPages &&
    totalPages > 0 &&
    currentPage > totalPages
  ) {
    errors.currentPage = t('validation.progress.currentBeyondTotal', undefined, language)
  }

  return errors
}

function UpdateProgressModal({ book, isOpen, onClose, onSubmit }) {
  const { language, t: translate } = usePreferences()
  const [values, setValues] = useState(() => getInitialValues(book))
  const [errors, setErrors] = useState({})
  const [wasSubmitted, setWasSubmitted] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setValues(getInitialValues(book))
      setErrors({})
      setWasSubmitted(false)
    }
  }, [book, isOpen])

  function updateField(field, value) {
    const nextValues = {
      ...values,
      [field]: value,
    }

    setValues(nextValues)

    if (wasSubmitted || errors[field]) {
      setErrors(validate(nextValues, language.value))
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    setWasSubmitted(true)

    const nextErrors = validate(values, language.value)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    onSubmit({
      currentPage: values.currentPage === '' ? 0 : Number(values.currentPage),
      totalPages: values.totalPages === '' ? 0 : Number(values.totalPages),
    })
  }

  return (
    <Modal isOpen={isOpen} title={translate('books.updateProgressTitle')} onClose={onClose}>
      <form className="book-form progress-form" noValidate onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="form-field">
            <span>{translate('bookFields.currentPage')}</span>
            <input
              aria-describedby={errors.currentPage ? 'current-page-error' : undefined}
              aria-invalid={errors.currentPage ? 'true' : 'false'}
              min="0"
              step="1"
              type="number"
              value={values.currentPage}
              onChange={(event) => updateField('currentPage', event.target.value)}
            />
            {errors.currentPage ? (
              <p className="field-error" id="current-page-error">
                {errors.currentPage}
              </p>
            ) : null}
          </label>

          <label className="form-field">
            <span>{translate('bookFields.totalPages')}</span>
            <input
              aria-describedby={errors.totalPages ? 'total-pages-error' : undefined}
              aria-invalid={errors.totalPages ? 'true' : 'false'}
              min="0"
              step="1"
              type="number"
              value={values.totalPages}
              onChange={(event) => updateField('totalPages', event.target.value)}
            />
            {errors.totalPages ? (
              <p className="field-error" id="total-pages-error">
                {errors.totalPages}
              </p>
            ) : null}
          </label>
        </div>

        <div className="form-actions">
          <button className="button button-secondary" type="button" onClick={onClose}>
            {translate('common.cancel')}
          </button>
          <button className="button button-primary" type="submit">
            {translate('books.saveProgress')}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default UpdateProgressModal
