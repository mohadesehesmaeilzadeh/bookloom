import { useEffect, useState } from 'react'
import { usePreferences } from '../../context/usePreferences'
import BookRating from './BookRating'

function BookReviewSection({ disabled = false, onRatingChange, onReviewSave, personalReview = '', rating = 0 }) {
  const { t } = usePreferences()
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
          <h3 id="book-review-title">{t('review.title')}</h3>
          <p>{t('review.description')}</p>
        </div>
        {!isEditing ? (
          <button className="button button-secondary" type="button" onClick={() => setIsEditing(true)}>
            {t('review.edit')}
          </button>
        ) : null}
      </div>

      <div className="review-rating-row">
        <BookRating disabled={disabled} rating={rating} onChange={onRatingChange} />
      </div>

      {isEditing ? (
        <div className="book-form">
          <label className="form-field">
            <span>{t('review.title')}</span>
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
              {t('common.cancel')}
            </button>
            <button className="button button-primary" type="button" onClick={handleSave}>
              {t('review.save')}
            </button>
          </div>
        </div>
      ) : personalReview ? (
        <p className="preserved-text">{personalReview}</p>
      ) : (
        <div className="soft-empty-state">{t('review.empty')}</div>
      )}
    </section>
  )
}

export default BookReviewSection
