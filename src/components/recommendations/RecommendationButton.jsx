import { useState } from 'react'
import { getEligibleRecommendationBooks } from '../../utils/bookRecommendations'
import { useBooksContext } from '../../context/useBooksContext'
import RecommendationModal from './RecommendationModal'

function RecommendationButton({ onFeedback }) {
  const { books } = useBooksContext()
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
        پیشنهاد کتاب بعدی
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
