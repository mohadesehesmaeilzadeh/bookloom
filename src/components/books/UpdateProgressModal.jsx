import { useEffect, useState } from 'react'
import Modal from '../common/Modal'

function getInitialValues(book) {
  return {
    currentPage: book?.currentPage > 0 ? String(book.currentPage) : '',
    totalPages: book?.totalPages > 0 ? String(book.totalPages) : '',
  }
}

function validate(values) {
  const errors = {}
  const currentPage = values.currentPage === '' ? 0 : Number(values.currentPage)
  const totalPages = values.totalPages === '' ? 0 : Number(values.totalPages)

  if (!Number.isFinite(currentPage)) {
    errors.currentPage = 'مقدار واردشده معتبر نیست.'
  } else if (currentPage < 0) {
    errors.currentPage = 'شماره صفحه نمی‌تواند منفی باشد.'
  }

  if (!Number.isFinite(totalPages)) {
    errors.totalPages = 'مقدار واردشده معتبر نیست.'
  } else if (totalPages < 0) {
    errors.totalPages = 'تعداد کل صفحات نمی‌تواند منفی باشد.'
  }

  if (
    !errors.currentPage &&
    !errors.totalPages &&
    totalPages > 0 &&
    currentPage > totalPages
  ) {
    errors.currentPage = 'صفحه فعلی نمی‌تواند بیشتر از تعداد کل صفحات باشد.'
  }

  return errors
}

function UpdateProgressModal({ book, isOpen, onClose, onSubmit }) {
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
      setErrors(validate(nextValues))
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    setWasSubmitted(true)

    const nextErrors = validate(values)
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
    <Modal isOpen={isOpen} title="به‌روزرسانی پیشرفت مطالعه" onClose={onClose}>
      <form className="book-form progress-form" noValidate onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="form-field">
            <span>صفحه فعلی</span>
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
            <span>تعداد کل صفحات</span>
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
            انصراف
          </button>
          <button className="button button-primary" type="submit">
            ذخیره پیشرفت
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default UpdateProgressModal
