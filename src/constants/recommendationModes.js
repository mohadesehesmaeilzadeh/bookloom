import { t } from '../i18n/localization'

export const RECOMMENDATION_MODE = {
  RANDOM: 'random',
  HIGHEST_PRIORITY: 'highestPriority',
  OLDEST_PURCHASE: 'oldestPurchase',
  SHORTEST_BOOK: 'shortestBook',
  SELECTED_CATEGORY: 'selectedCategory',
  WEIGHTED: 'weighted',
}

export const DEFAULT_RECOMMENDATION_MODE = RECOMMENDATION_MODE.WEIGHTED

export const recommendationModes = [
  {
    value: RECOMMENDATION_MODE.WEIGHTED,
    labelKey: 'recommendation.mode.weighted.label',
    descriptionKey: 'recommendation.mode.weighted.description',
  },
  {
    value: RECOMMENDATION_MODE.RANDOM,
    labelKey: 'recommendation.mode.random.label',
    descriptionKey: 'recommendation.mode.random.description',
  },
  {
    value: RECOMMENDATION_MODE.HIGHEST_PRIORITY,
    labelKey: 'recommendation.mode.highestPriority.label',
    descriptionKey: 'recommendation.mode.highestPriority.description',
  },
  {
    value: RECOMMENDATION_MODE.OLDEST_PURCHASE,
    labelKey: 'recommendation.mode.oldestPurchase.label',
    descriptionKey: 'recommendation.mode.oldestPurchase.description',
  },
  {
    value: RECOMMENDATION_MODE.SHORTEST_BOOK,
    labelKey: 'recommendation.mode.shortestBook.label',
    descriptionKey: 'recommendation.mode.shortestBook.description',
  },
  {
    value: RECOMMENDATION_MODE.SELECTED_CATEGORY,
    labelKey: 'recommendation.mode.selectedCategory.label',
    descriptionKey: 'recommendation.mode.selectedCategory.description',
  },
]

export const recommendationModeByValue = Object.fromEntries(
  recommendationModes.map((mode) => [mode.value, mode]),
)

export function getRecommendationModes(language) {
  return recommendationModes.map((mode) => ({
    ...mode,
    description: t(mode.descriptionKey, undefined, language),
    label: t(mode.labelKey, undefined, language),
  }))
}

export function getRecommendationModeByValue(language) {
  return Object.fromEntries(
    getRecommendationModes(language).map((mode) => [mode.value, mode]),
  )
}
