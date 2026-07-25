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
  recommendationModeByValue,
  recommendationModes,
} from '../../constants/recommendationModes'
import { ROUTES } from '../../constants/routes'
import { useBooksContext } from '../../context/useBooksContext'
import { useBookRecommendation } from '../../hooks/useBookRecommendation'
import { createStatusTransitionUpdates } from '../../utils/applyBookStatusTransition'
import { isBookRecommendationEligible } from '../../utils/bookRecommendations'
import { formatNumber } from '../../utils/formatNumber'
import RecommendationResult from './RecommendationResult'

function RecommendationModal({ isOpen, onClose, onFeedback }) {
  const navigate = useNavigate()
  const { getBookById, updateBook } = useBooksContext()
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
  const selectedMode = recommendationModeByValue[mode]
  const requiresCategory = mode === RECOMMENDATION_MODE.SELECTED_CATEGORY
  const showsCategory =
    mode === RECOMMENDATION_MODE.SELECTED_CATEGORY || mode === RECOMMENDATION_MODE.WEIGHTED

  function handleGenerate() {
    if (requiresCategory && !selectedCategory) {
      setValidationMessage('برای این روش باید یک دسته‌بندی انتخاب شود.')
      return
    }

    setValidationMessage('')
    const result = generateRecommendation()

    onFeedback?.(
      result?.book
        ? 'کتاب برای مطالعه پیشنهاد شد.'
        : result?.message ?? 'در حال حاضر کتابی برای پیشنهاد وجود ندارد.',
    )
  }

  function handleGenerateAnother() {
    setValidationMessage('')
    const result = generateAnotherRecommendation()

    onFeedback?.(
      result?.book
        ? 'کتاب برای مطالعه پیشنهاد شد.'
        : result?.message ?? 'در حال حاضر کتابی برای پیشنهاد وجود ندارد.',
    )
  }

  function handleStartReading(recommendedBook) {
    const latestBook = getBookById(recommendedBook.id)

    if (!latestBook || !isBookRecommendationEligible(latestBook)) {
      setRecommendation({
        book: null,
        message: 'وضعیت این کتاب تغییر کرده است. لطفاً دوباره پیشنهاد بگیر.',
        reasons: [],
      })
      onFeedback?.('وضعیت این کتاب تغییر کرده است. لطفاً دوباره پیشنهاد بگیر.')
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
        message: 'برای وضعیت فعلی این کتاب اقدام مطالعه معتبر نیست.',
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
          ? 'مطالعه کتاب ادامه پیدا کرد.'
          : 'مطالعه کتاب شروع شد.',
      )
      onClose()
      navigate(ROUTES.READING)
    }
  }

  return (
    <Modal isOpen={isOpen} title="کتاب بعدی را انتخاب کن" onClose={onClose}>
      <div className="recommendation-modal">
        <p className="muted-note">
          Bookloom براساس کتاب‌های موجود در کتابخانه، یک گزینه برای مطالعه بعدی پیشنهاد می‌دهد.
        </p>

        <div className="recommendation-controls">
          <label className="form-field">
            <span>روش پیشنهاد</span>
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
              <span>{requiresCategory ? 'دسته‌بندی' : 'دسته‌بندی دلخواه'}</span>
              <select
                value={selectedCategory}
                onChange={(event) => {
                  setSelectedCategory(event.target.value)
                  setValidationMessage('')
                }}
              >
                <option value="">
                  {requiresCategory ? 'انتخاب دسته‌بندی' : 'بدون دسته‌بندی دلخواه'}
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
        <p className="result-count">تعداد کتاب‌های قابل پیشنهاد: {formatNumber(eligibleCount)}</p>

        {validationMessage ? <p className="field-error">{validationMessage}</p> : null}

        <div className="form-actions">
          <button
            className="button button-primary"
            disabled={eligibleCount === 0 || (requiresCategory && !selectedCategory)}
            type="button"
            onClick={handleGenerate}
          >
            پیشنهاد کتاب
          </button>
        </div>

        {eligibleCount === 0 && !recommendation ? (
          <div className="empty-state recommendation-empty">
            <h3>در حال حاضر کتاب مناسبی برای پیشنهاد وجود ندارد.</h3>
            <p>
              کتابی با وضعیت «خریداری‌شده» به کتابخانه اضافه کن یا یکی از کتاب‌های متوقف‌شده را
              نگه دار.
            </p>
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
