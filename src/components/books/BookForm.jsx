import { useEffect, useState } from 'react'
import { getBookPriorities } from '../../constants/bookPriorities'
import { BOOK_STATUS, getBookStatuses } from '../../constants/bookStatuses'
import { usePreferences } from '../../context/usePreferences'
import {
  createBookFormPayload,
  getInitialBookFormValues,
  hasBookFormErrors,
  validateBookForm,
} from '../../utils/validateBookForm'
import OpenLibraryBookSearch from './OpenLibraryBookSearch'

const fieldLabelKeys = {
  title: 'bookFields.title',
  author: 'bookFields.author',
  translator: 'bookFields.translator',
  publisher: 'bookFields.publisher',
  category: 'bookFields.category',
  status: 'bookFields.status',
  purchaseDate: 'bookFields.purchaseDate',
  totalPages: 'bookFields.totalPages',
  price: 'bookFields.price',
  expectedPrice: 'bookFields.expectedPrice',
  purchaseStore: 'bookFields.purchaseStore',
  priority: 'bookFields.priority',
  notes: 'bookFields.notes',
}

function BookForm({
  book,
  enableOnlineSearch = false,
  onCancel,
  onSubmit,
  submitLabel,
  variant = 'default',
}) {
  const { language, t } = usePreferences()
  const isWishlistVariant = variant === 'wishlist'
  const bookPriorities = getBookPriorities(language.value)
  const bookStatuses = getBookStatuses(language.value)
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
      setErrors(validateBookForm(nextValues, language.value))
    }
  }

  function prefillFromOnlineBook(bookData) {
    const selectedValues = getInitialBookFormValues(bookData)
    const nextValues = {
      ...values,
      title: selectedValues.title || values.title,
      author: selectedValues.author || values.author,
      publisher: selectedValues.publisher || values.publisher,
      totalPages: selectedValues.totalPages || values.totalPages,
    }

    setValues(nextValues)

    if (wasSubmitted || Object.keys(errors).length > 0) {
      setErrors(validateBookForm(nextValues, language.value))
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

    const nextErrors = validateBookForm(values, language.value)
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
      {enableOnlineSearch ? (
        <OpenLibraryBookSearch onSelectBook={prefillFromOnlineBook} />
      ) : null}

      <div className="form-grid">
        <label className="form-field form-field-wide">
          <span>{t(fieldLabelKeys.title)}</span>
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
          <span>{t(fieldLabelKeys.status)}</span>
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
          <span>{t(fieldLabelKeys.priority)}</span>
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
              <span>{t(fieldLabelKeys.purchaseDate)}</span>
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
          label={isWishlistVariant ? t('bookFields.suggestedStore') : t(fieldLabelKeys.purchaseStore)}
          value={values.purchaseStore}
          onChange={updateField}
        />

        <label className="form-field form-field-wide">
          <span>{t(fieldLabelKeys.notes)}</span>
          <textarea
            rows="4"
            value={values.notes}
            onChange={(event) => updateField('notes', event.target.value)}
          />
        </label>
      </div>

      <div className="form-actions">
        <button className="button button-secondary" type="button" onClick={onCancel}>
          {t('common.cancel')}
        </button>
        <button className="button button-primary" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

function TextField({ field, label, onChange, value }) {
  const { t } = usePreferences()

  return (
    <label className="form-field">
      <span>{label ?? t(fieldLabelKeys[field])}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(field, event.target.value)}
      />
    </label>
  )
}

function NumberField({ error, field, onChange, step = 'any', value }) {
  const { t } = usePreferences()

  return (
    <label className="form-field">
      <span>{t(fieldLabelKeys[field])}</span>
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
