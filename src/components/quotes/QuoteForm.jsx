import { useEffect, useState } from 'react'
import { validateQuoteInput } from '../../utils/quoteValidation'

function getInitialValues(quote) {
  return {
    text: quote?.text ?? '',
    pageNumber: quote?.pageNumber === '' || quote?.pageNumber === undefined ? '' : String(quote.pageNumber),
    personalNote: quote?.personalNote ?? '',
  }
}

function QuoteForm({ mode = 'create', onCancel, onSubmit, quote }) {
  const [values, setValues] = useState(() => getInitialValues(quote))
  const [errors, setErrors] = useState({})
  const [wasSubmitted, setWasSubmitted] = useState(false)

  useEffect(() => {
    setValues(getInitialValues(quote))
    setErrors({})
    setWasSubmitted(false)
  }, [quote])

  function updateField(field, value) {
    const nextValues = { ...values, [field]: value }
    setValues(nextValues)

    if (wasSubmitted || errors[field]) {
      setErrors(validateQuoteInput(nextValues))
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    setWasSubmitted(true)

    const nextErrors = validateQuoteInput(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    onSubmit({
      text: values.text,
      pageNumber: values.pageNumber === '' ? '' : Number(values.pageNumber),
      personalNote: values.personalNote,
    })
  }

  return (
    <form className="book-form quote-form" noValidate onSubmit={handleSubmit}>
      <label className="form-field">
        <span>متن نقل‌قول</span>
        <textarea
          aria-describedby={errors.text ? 'quote-text-error' : undefined}
          aria-invalid={errors.text ? 'true' : 'false'}
          value={values.text}
          onChange={(event) => updateField('text', event.target.value)}
        />
        {errors.text ? (
          <p className="field-error" id="quote-text-error">
            {errors.text}
          </p>
        ) : null}
      </label>

      <label className="form-field">
        <span>شماره صفحه</span>
        <input
          aria-describedby={errors.pageNumber ? 'quote-page-error' : undefined}
          aria-invalid={errors.pageNumber ? 'true' : 'false'}
          min="0"
          step="1"
          type="number"
          value={values.pageNumber}
          onChange={(event) => updateField('pageNumber', event.target.value)}
        />
        {errors.pageNumber ? (
          <p className="field-error" id="quote-page-error">
            {errors.pageNumber}
          </p>
        ) : null}
      </label>

      <label className="form-field">
        <span>یادداشت شخصی</span>
        <textarea
          value={values.personalNote}
          onChange={(event) => updateField('personalNote', event.target.value)}
        />
      </label>

      <div className="form-actions">
        <button className="button button-secondary" type="button" onClick={onCancel}>
          انصراف
        </button>
        <button className="button button-primary" type="submit">
          {mode === 'edit' ? 'ذخیره تغییرات' : 'افزودن نقل‌قول'}
        </button>
      </div>
    </form>
  )
}

export default QuoteForm
