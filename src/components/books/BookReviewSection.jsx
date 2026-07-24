import { useEffect, useState } from 'react'
import BookRating from './BookRating'

function BookReviewSection({ disabled = false, onRatingChange, onReviewSave, personalReview = '', rating = 0 }) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(personalReview)

  useEffect(() => {
    if (!isEditing) {
      setValue(personalReview)
    }
  }, [isEditing, personalReview])

  function handleSave() {
    onReviewSave(value.trim())
    setIsEditing(false)
  }

  return (
    <section className="details-section editable-text-section" aria-labelledby="book-review-title">
      <div className="dashboard-item-header">
        <div>
          <h3 id="book-review-title">نظر شخصی من</h3>
          <p>ثبت نظر بعد از پایان مطالعه مفیدتر است، اما هر زمان می‌توانی آن را بنویسی.</p>
        </div>
        {!isEditing ? (
          <button className="button button-secondary" type="button" onClick={() => setIsEditing(true)}>
            ویرایش نظر
          </button>
        ) : null}
      </div>

      <div className="review-rating-row">
        <BookRating disabled={disabled} rating={rating} onChange={onRatingChange} />
      </div>

      {isEditing ? (
        <div className="book-form">
          <label className="form-field">
            <span>نظر شخصی من</span>
            <textarea value={value} onChange={(event) => setValue(event.target.value)} />
          </label>
          <div className="form-actions">
            <button
              className="button button-secondary"
              type="button"
              onClick={() => {
                setValue(personalReview)
                setIsEditing(false)
              }}
            >
              انصراف
            </button>
            <button className="button button-primary" type="button" onClick={handleSave}>
              ذخیره نظر
            </button>
          </div>
        </div>
      ) : personalReview ? (
        <p className="preserved-text">{personalReview}</p>
      ) : (
        <div className="soft-empty-state">هنوز نظر شخصی برای این کتاب ثبت نشده است.</div>
      )}
    </section>
  )
}

export default BookReviewSection
