import { useEffect, useState } from 'react'
import Modal from '../common/Modal'
import { getTodayDateString } from '../../utils/dateUtils'

function getInitialValues(book) {
  return {
    purchaseDate: getTodayDateString(),
    price: '',
    purchaseStore: book?.purchaseStore ?? '',
  }
}

function PurchaseBookModal({ book, isOpen, onClose, onConfirm }) {
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

  function validate(nextValues) {
    const nextErrors = {}
    const price = Number(nextValues.price)

    if (nextValues.price !== '' && (!Number.isFinite(price) || price < 0)) {
      nextErrors.price = 'قیمت پرداخت‌شده نمی‌تواند منفی باشد.'
    }

    if (!nextValues.purchaseDate) {
      nextErrors.purchaseDate = 'تاریخ خرید الزامی است.'
    }

    return nextErrors
  }

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

    onConfirm({
      purchaseDate: values.purchaseDate,
      price: values.price === '' ? 0 : Number(values.price),
      purchaseStore: values.purchaseStore.trim(),
    })
  }

  return (
    <Modal isOpen={isOpen} title="ثبت خرید کتاب" onClose={onClose}>
      <form className="book-form purchase-form" noValidate onSubmit={handleSubmit}>
        <div className="purchase-book-summary">
          <span>کتاب</span>
          <strong>{book?.title}</strong>
        </div>

        <div className="form-grid">
          <label className="form-field">
            <span>تاریخ خرید</span>
            <input
              aria-describedby={errors.purchaseDate ? 'purchase-date-error' : undefined}
              aria-invalid={errors.purchaseDate ? 'true' : 'false'}
              type="date"
              value={values.purchaseDate}
              onChange={(event) => updateField('purchaseDate', event.target.value)}
            />
            {errors.purchaseDate ? (
              <p className="field-error" id="purchase-date-error">
                {errors.purchaseDate}
              </p>
            ) : null}
          </label>

          <label className="form-field">
            <span>قیمت پرداخت‌شده</span>
            <input
              aria-describedby={errors.price ? 'purchase-price-error' : undefined}
              aria-invalid={errors.price ? 'true' : 'false'}
              min="0"
              step="any"
              type="number"
              value={values.price}
              onChange={(event) => updateField('price', event.target.value)}
            />
            {errors.price ? (
              <p className="field-error" id="purchase-price-error">
                {errors.price}
              </p>
            ) : null}
          </label>

          <label className="form-field form-field-wide">
            <span>فروشگاه</span>
            <input
              type="text"
              value={values.purchaseStore}
              onChange={(event) => updateField('purchaseStore', event.target.value)}
            />
          </label>
        </div>

        <div className="form-actions">
          <button className="button button-secondary" type="button" onClick={onClose}>
            انصراف
          </button>
          <button className="button button-primary" type="submit">
            ثبت خرید
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default PurchaseBookModal
