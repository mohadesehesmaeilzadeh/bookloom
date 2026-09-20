import { useState } from 'react'
import { getEligibleRecommendationBooks } from '../../utils/bookRecommendations'
import { useBooksContext } from '../../context/useBooksContext'
import { usePreferences } from '../../context/usePreferences'
import RecommendationModal from './RecommendationModal'

function RecommendationButton({ onFeedback }) {
  const { books } = useBooksContext()
  const { t } = usePreferences()
  const [isOpen, setIsOpen] = useState(false)
  const eligibleCount = getEligibleRecommendationBooks(books).length

  return (
    <>
      <button
        className="button button-secondary"
        disabled={eligibleCount === 0}
        type="button"
        onClick={() => setIsOpen(true)}
      >
        {t('recommendation.button')}
      </button>
      <RecommendationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onFeedback={onFeedback}
      />
    </>
  )
}

export default RecommendationButton
