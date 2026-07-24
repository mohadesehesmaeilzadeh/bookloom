import { formatNumber } from '../../utils/formatNumber'

function BookRating({ disabled = false, onChange, rating = 0, readOnly = false }) {
  const normalizedRating = Math.max(0, Math.min(5, Math.floor(Number(rating) || 0)))

  return (
    <div className="book-rating">
      <div className="rating-stars" role={readOnly ? undefined : 'group'} aria-label="امتیاز کتاب">
        {[1, 2, 3, 4, 5].map((value) => {
          const isActive = value <= normalizedRating

          if (readOnly) {
            return (
              <span className={isActive ? 'rating-star active' : 'rating-star'} key={value}>
                {isActive ? '★' : '☆'}
              </span>
            )
          }

          return (
            <button
              aria-label={`ثبت امتیاز ${formatNumber(value)} از ${formatNumber(5)}`}
              aria-pressed={normalizedRating === value}
              className={isActive ? 'rating-star active' : 'rating-star'}
              disabled={disabled}
              key={value}
              type="button"
              onClick={() => onChange?.(value)}
            >
              {isActive ? '★' : '☆'}
            </button>
          )
        })}
      </div>
      <p>
        {normalizedRating > 0
          ? `${formatNumber(normalizedRating)} از ${formatNumber(5)}`
          : 'بدون امتیاز'}
      </p>
      {!readOnly && normalizedRating > 0 ? (
        <button
          className="button button-ghost"
          disabled={disabled}
          type="button"
          onClick={() => onChange?.(0)}
        >
          حذف امتیاز
        </button>
      ) : null}
    </div>
  )
}

export default BookRating
