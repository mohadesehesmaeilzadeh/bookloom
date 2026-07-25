import { useEffect, useState } from 'react'
import { bookPriorities } from '../../constants/bookPriorities'
import { BOOK_STATUS, bookStatuses } from '../../constants/bookStatuses'
import {
  createBookFormPayload,
  getInitialBookFormValues,
  hasBookFormErrors,
  validateBookForm,
} from '../../utils/validateBookForm'

const fieldLabels = {
  title: 'نام کتاب',
  author: 'نویسنده',
  translator: 'مترجم',
  publisher: 'انتشارات',
  category: 'دسته‌بندی',
  status: 'وضعیت',
  purchaseDate: 'تاریخ خرید',
  totalPages: 'تعداد صفحات',
  price: 'قیمت خرید',
  expectedPrice: 'قیمت تقریبی',
  purchaseStore: 'فروشگاه',
  priority: 'اولویت',
  notes: 'یادداشت',
}

function BookForm({ book, onCancel, onSubmit, submitLabel, variant = 'default' }) {
  const isWishlistVariant = variant === 'wishlist'
  const [values, setValues] = useState(() => getInitialBookFormValues(book))
  const [errors, setErrors] = useState({})
  const [wasSubmitted, setWasSubmitted] = useState(false)

  useEffect(() => {
    setValues(getInitialBookFormValues(book))
    setErrors({})
    setWasSubmitted(false)
  }, [book])

  function updateField(field, value) {
    const nextValues = {
      ...values,
      [field]: value,
    }

    setValues(nextValues)

    if (wasSubmitted || errors[field]) {
      setErrors(validateBookForm(nextValues))
    }
  }

  function renderError(field) {
    if (!errors[field]) {
      return null
    }

    return (
      <p className="field-error" id={`${field}-error`}>
        {errors[field]}
      </p>
    )
  }

  function handleSubmit(event) {
    event.preventDefault()
    setWasSubmitted(true)

    const nextErrors = validateBookForm(values)
    setErrors(nextErrors)

    if (hasBookFormErrors(nextErrors)) {
      return
    }

    const payload = createBookFormPayload(values)

    if (isWishlistVariant) {
      payload.status = BOOK_STATUS.WISHLIST
      payload.purchaseDate = book?.purchaseDate ?? ''
      payload.price = book?.price ?? 0
    }

    onSubmit(payload)
  }

  return (
    <form className="book-form" noValidate onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="form-field form-field-wide">
          <span>{fieldLabels.title}</span>
          <input
            aria-describedby={errors.title ? 'title-error' : undefined}
            aria-invalid={errors.title ? 'true' : 'false'}
            autoFocus
            type="text"
            value={values.title}
            onChange={(event) => updateField('title', event.target.value)}
          />
          {renderError('title')}
        </label>

        <TextField field="author" value={values.author} onChange={updateField} />
        <TextField
          field="translator"
          value={values.translator}
          onChange={updateField}
        />
        <TextField field="publisher" value={values.publisher} onChange={updateField} />
        <TextField field="category" value={values.category} onChange={updateField} />

        {isWishlistVariant ? null : (
          <label className="form-field">
            <span>{fieldLabels.status}</span>
            <select
              aria-describedby={errors.status ? 'status-error' : undefined}
              aria-invalid={errors.status ? 'true' : 'false'}
              value={values.status}
              onChange={(event) => updateField('status', event.target.value)}
            >
              {bookStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            {renderError('status')}
          </label>
        )}

        <label className="form-field">
          <span>{fieldLabels.priority}</span>
          <select
            aria-describedby={errors.priority ? 'priority-error' : undefined}
            aria-invalid={errors.priority ? 'true' : 'false'}
            value={values.priority}
            onChange={(event) => updateField('priority', event.target.value)}
          >
            {bookPriorities.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
          {renderError('priority')}
        </label>

        {isWishlistVariant ? null : (
          <>
            <label className="form-field">
              <span>{fieldLabels.purchaseDate}</span>
              <input
                type="date"
                value={values.purchaseDate}
                onChange={(event) => updateField('purchaseDate', event.target.value)}
              />
            </label>

            <NumberField
              error={errors.totalPages}
              field="totalPages"
              step="1"
              value={values.totalPages}
              onChange={updateField}
            />
            <NumberField
              error={errors.price}
              field="price"
              value={values.price}
              onChange={updateField}
            />
          </>
        )}
        <NumberField
          error={errors.expectedPrice}
          field="expectedPrice"
          value={values.expectedPrice}
          onChange={updateField}
        />
        <TextField
          field="purchaseStore"
          label={isWishlistVariant ? 'فروشگاه پیشنهادی' : fieldLabels.purchaseStore}
          value={values.purchaseStore}
          onChange={updateField}
        />

        <label className="form-field form-field-wide">
          <span>{fieldLabels.notes}</span>
          <textarea
            rows="4"
            value={values.notes}
            onChange={(event) => updateField('notes', event.target.value)}
          />
        </label>
      </div>

      <div className="form-actions">
        <button className="button button-secondary" type="button" onClick={onCancel}>
          انصراف
        </button>
        <button className="button button-primary" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

function TextField({ field, label, onChange, value }) {
  return (
    <label className="form-field">
      <span>{label ?? fieldLabels[field]}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(field, event.target.value)}
      />
    </label>
  )
}

function NumberField({ error, field, onChange, step = 'any', value }) {
  return (
    <label className="form-field">
      <span>{fieldLabels[field]}</span>
      <input
        aria-describedby={error ? `${field}-error` : undefined}
        aria-invalid={error ? 'true' : 'false'}
        min="0"
        step={step}
        type="number"
        value={value}
        onChange={(event) => onChange(field, event.target.value)}
      />
      {error ? (
        <p className="field-error" id={`${field}-error`}>
          {error}
        </p>
      ) : null}
    </label>
  )
}

export default BookForm
