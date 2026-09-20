import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../common/Modal'
import { BOOK_STATUS } from '../../constants/bookStatuses'
import {
  BOOK_STATUS_ACTION,
  getStatusTransitions,
} from '../../constants/bookStatusTransitions'
import {
  RECOMMENDATION_MODE,
  getRecommendationModeByValue,
  getRecommendationModes,
} from '../../constants/recommendationModes'
import { ROUTES } from '../../constants/routes'
import { useBooksContext } from '../../context/useBooksContext'
import { usePreferences } from '../../context/usePreferences'
import { useBookRecommendation } from '../../hooks/useBookRecommendation'
import { createStatusTransitionUpdates } from '../../utils/applyBookStatusTransition'
import { isBookRecommendationEligible } from '../../utils/bookRecommendations'
import { formatNumber } from '../../utils/formatNumber'
import RecommendationResult from './RecommendationResult'

function RecommendationModal({ isOpen, onClose, onFeedback }) {
  const navigate = useNavigate()
  const { getBookById, updateBook } = useBooksContext()
  const { language, t } = usePreferences()
  const [validationMessage, setValidationMessage] = useState('')
  const {
    categories,
    eligibleCount,
    generateAnotherRecommendation,
    generateRecommendation,
    mode,
    recommendation,
    selectedCategory,
    setMode,
    setRecommendation,
    setSelectedCategory,
  } = useBookRecommendation()
  const recommendationModes = getRecommendationModes(language.value)
  const selectedMode = getRecommendationModeByValue(language.value)[mode]
  const requiresCategory = mode === RECOMMENDATION_MODE.SELECTED_CATEGORY
  const showsCategory =
    mode === RECOMMENDATION_MODE.SELECTED_CATEGORY || mode === RECOMMENDATION_MODE.WEIGHTED

  function handleGenerate() {
    if (requiresCategory && !selectedCategory) {
      setValidationMessage(t('recommendation.categoryValidation'))
      return
    }

    setValidationMessage('')
    const result = generateRecommendation()

    onFeedback?.(
      result?.book
        ? t('recommendation.generated')
        : result?.message ?? t('recommendation.none'),
    )
  }

  function handleGenerateAnother() {
    setValidationMessage('')
    const result = generateAnotherRecommendation()

    onFeedback?.(
      result?.book
        ? t('recommendation.generated')
        : result?.message ?? t('recommendation.none'),
    )
  }

  function handleStartReading(recommendedBook) {
    const latestBook = getBookById(recommendedBook.id)

    if (!latestBook || !isBookRecommendationEligible(latestBook)) {
      setRecommendation({
        book: null,
        message: t('recommendation.changed'),
        reasons: [],
      })
      onFeedback?.(t('recommendation.changed'))
      return
    }

    const action =
      latestBook.status === BOOK_STATUS.PAUSED
        ? BOOK_STATUS_ACTION.RESUME_READING
        : BOOK_STATUS_ACTION.START_READING
    const transition = getStatusTransitions(latestBook.status).find(
      (item) => item.action === action,
    )

    if (!transition) {
      setRecommendation({
        book: null,
        message: t('recommendation.invalidAction'),
        reasons: [],
      })
      return
    }

    const result = updateBook(
      latestBook.id,
      createStatusTransitionUpdates(latestBook, transition),
    )

    if (result.success) {
      onFeedback?.(
        latestBook.status === BOOK_STATUS.PAUSED
          ? t('statusAction.resume-reading.feedback')
          : t('statusAction.start-reading.feedback'),
      )
      onClose()
      navigate(ROUTES.READING)
    }
  }

  return (
    <Modal isOpen={isOpen} title={t('recommendation.modalTitle')} onClose={onClose}>
      <div className="recommendation-modal">
        <p className="muted-note">
          {t('recommendation.modalDescription')}
        </p>

        <div className="recommendation-controls">
          <label className="form-field">
            <span>{t('recommendation.modeLabel')}</span>
            <select
              value={mode}
              onChange={(event) => {
                setMode(event.target.value)
                setValidationMessage('')
              }}
            >
              {recommendationModes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          {showsCategory ? (
            <label className="form-field">
              <span>{requiresCategory ? t('recommendation.categoryRequired') : t('recommendation.categoryOptional')}</span>
              <select
                value={selectedCategory}
                onChange={(event) => {
                  setSelectedCategory(event.target.value)
                  setValidationMessage('')
                }}
              >
                <option value="">
                  {requiresCategory ? t('recommendation.selectCategory') : t('recommendation.noPreferredCategory')}
                </option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>

        <p className="mode-description">{selectedMode?.description}</p>
        <p className="result-count">
          {t('recommendation.eligibleLabel', { count: formatNumber(eligibleCount) })}
        </p>

        {validationMessage ? <p className="field-error">{validationMessage}</p> : null}

        <div className="form-actions">
          <button
            className="button button-primary"
            disabled={eligibleCount === 0 || (requiresCategory && !selectedCategory)}
            type="button"
            onClick={handleGenerate}
          >
            {t('recommendation.generate')}
          </button>
        </div>

        {eligibleCount === 0 && !recommendation ? (
          <div className="empty-state recommendation-empty">
            <h3>{t('recommendation.noEligibleTitle')}</h3>
            <p>{t('recommendation.noEligibleDescription')}</p>
          </div>
        ) : null}

        {recommendation ? (
          <RecommendationResult
            recommendation={recommendation}
            onClose={onClose}
            onGenerateAnother={handleGenerateAnother}
            onStartReading={handleStartReading}
          />
        ) : null}
      </div>
    </Modal>
  )
}

export default RecommendationModal
