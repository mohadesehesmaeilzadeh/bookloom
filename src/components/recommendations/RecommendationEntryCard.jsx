import { useState } from 'react'
import { useBooksContext } from '../../context/useBooksContext'
import { getEligibleRecommendationBooks } from '../../utils/bookRecommendations'
import { formatNumber } from '../../utils/formatNumber'
import RecommendationModal from './RecommendationModal'

function RecommendationEntryCard({ onFeedback }) {
  const { books } = useBooksContext()
  const [isOpen, setIsOpen] = useState(false)
  const eligibleCount = getEligibleRecommendationBooks(books).length

  return (
    <section className="dashboard-section" aria-labelledby="recommendation-entry-title">
      <div className="recommendation-entry dashboard-panel">
        <div>
          <h2 id="recommendation-entry-title">کتاب بعدی چی بخونم؟</h2>
          <p>از بین کتاب‌های کتابخانه، یک گزینه برای مطالعه بعدی انتخاب کن.</p>
          <span>{formatNumber(eligibleCount)} کتاب قابل پیشنهاد</span>
        </div>
        <button className="button button-primary" type="button" onClick={() => setIsOpen(true)}>
          گرفتن پیشنهاد
        </button>
      </div>

      <RecommendationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onFeedback={onFeedback}
      />
    </section>
  )
}

export default RecommendationEntryCard
