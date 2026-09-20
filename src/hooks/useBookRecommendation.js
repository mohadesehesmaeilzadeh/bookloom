import { useMemo, useState } from 'react'
import { DEFAULT_RECOMMENDATION_MODE, RECOMMENDATION_MODE } from '../constants/recommendationModes'
import { useBooksContext } from '../context/useBooksContext'
import { usePreferences } from '../context/usePreferences'
import {
  getEligibleRecommendationBooks,
  getRecommendationCategories,
  getRecommendationForMode,
  getWeightedRecommendations,
} from '../utils/bookRecommendations'

export function useBookRecommendation() {
  const { books } = useBooksContext()
  const { language, t } = usePreferences()
  const [mode, setMode] = useState(DEFAULT_RECOMMENDATION_MODE)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [recommendation, setRecommendation] = useState(null)
  const [previousBookId, setPreviousBookId] = useState('')
  const [weightedIndex, setWeightedIndex] = useState(0)
  const eligibleBooks = useMemo(() => getEligibleRecommendationBooks(books), [books])
  const categories = useMemo(() => getRecommendationCategories(books), [books])

  function generateRecommendation() {
    const nextRecommendation = getRecommendationForMode(eligibleBooks, {
      mode,
      selectedCategory,
      language: language.value,
    })

    setRecommendation(nextRecommendation)
    setPreviousBookId(nextRecommendation?.book?.id ?? '')
    setWeightedIndex(0)

    return nextRecommendation
  }

  function generateAnotherRecommendation() {
    if (mode === RECOMMENDATION_MODE.WEIGHTED) {
      const rankedRecommendations = getWeightedRecommendations(eligibleBooks, {
        selectedCategory,
        language: language.value,
      })

      if (rankedRecommendations.length === 0) {
        setRecommendation(null)
        setPreviousBookId('')
        return null
      }

      const nextIndex = (weightedIndex + 1) % rankedRecommendations.length
      const nextRecommendation = rankedRecommendations[nextIndex]
      setWeightedIndex(nextIndex)
      setRecommendation(nextRecommendation)
      setPreviousBookId(nextRecommendation.book.id)

      return nextRecommendation
    }

    const nextRecommendation = getRecommendationForMode(eligibleBooks, {
      mode,
      previousBookId,
      selectedCategory,
      language: language.value,
    })

    const stableRecommendation =
      nextRecommendation?.book?.id &&
      nextRecommendation.book.id === previousBookId &&
      mode !== RECOMMENDATION_MODE.RANDOM
        ? {
            ...nextRecommendation,
            reasons: [
              ...nextRecommendation.reasons,
              t('recommendation.reason.sameBest'),
            ],
          }
        : nextRecommendation

    setRecommendation(stableRecommendation)
    setPreviousBookId(nextRecommendation?.book?.id ?? '')

    return stableRecommendation
  }

  function clearRecommendation() {
    setRecommendation(null)
    setPreviousBookId('')
    setWeightedIndex(0)
  }

  return {
    categories,
    clearRecommendation,
    eligibleBooks,
    eligibleCount: eligibleBooks.length,
    generateAnotherRecommendation,
    generateRecommendation,
    mode,
    recommendation,
    selectedCategory,
    setMode,
    setRecommendation,
    setSelectedCategory,
  }
}
