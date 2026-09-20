import { useState } from 'react'
import { useBooksContext } from '../../context/useBooksContext'
import { usePreferences } from '../../context/usePreferences'
import { getEligibleRecommendationBooks } from '../../utils/bookRecommendations'
import { formatNumber } from '../../utils/formatNumber'
import RecommendationModal from './RecommendationModal'

function RecommendationEntryCard({ onFeedback }) {
  const { books } = useBooksContext()
  const { t } = usePreferences()
  const [isOpen, setIsOpen] = useState(false)
  const eligibleCount = getEligibleRecommendationBooks(books).length

  return (
    <section className="dashboard-section" aria-labelledby="recommendation-entry-title">
      <div className="recommendation-entry dashboard-panel">
        <div>
          <h2 id="recommendation-entry-title">{t('recommendation.entryTitle')}</h2>
          <p>{t('recommendation.entryDescription')}</p>
          <span>{t('recommendation.eligibleCount', { count: formatNumber(eligibleCount) })}</span>
        </div>
        <button className="button button-primary" type="button" onClick={() => setIsOpen(true)}>
          {t('recommendation.open')}
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
