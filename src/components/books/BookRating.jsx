import { formatNumber } from '../../utils/formatNumber'
import { usePreferences } from '../../context/usePreferences'

function BookRating({ disabled = false, onChange, rating = 0, readOnly = false }) {
  const { t } = usePreferences()
  const normalizedRating = Math.max(0, Math.min(5, Math.floor(Number(rating) || 0)))

  return (
    <div className="book-rating">
      <div className="rating-stars" role={readOnly ? undefined : 'group'} aria-label={t('rating.label')}>
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
              aria-label={t('rating.set', {
                total: formatNumber(5),
                value: formatNumber(value),
              })}
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
          ? t('rating.value', {
              total: formatNumber(5),
              value: formatNumber(normalizedRating),
            })
          : t('rating.none')}
      </p>
      {!readOnly && normalizedRating > 0 ? (
        <button
          className="button button-ghost"
          disabled={disabled}
          type="button"
          onClick={() => onChange?.(0)}
        >
          {t('rating.clear')}
        </button>
      ) : null}
    </div>
  )
}

export default BookRating
