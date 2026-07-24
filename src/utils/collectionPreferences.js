import { DEFAULT_VIEW_MODE, viewModeValues } from '../constants/viewModes'

const COLLECTION_PREFERENCES_KEY = 'bookloom_collection_preferences'

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function normalizeViewMode(value) {
  return viewModeValues.includes(value) ? value : DEFAULT_VIEW_MODE
}

export function loadCollectionPreferences() {
  if (!canUseLocalStorage()) {
    return {}
  }

  try {
    const rawPreferences = window.localStorage.getItem(COLLECTION_PREFERENCES_KEY)

    if (!rawPreferences) {
      return {}
    }

    const parsedPreferences = JSON.parse(rawPreferences)

    if (!parsedPreferences || typeof parsedPreferences !== 'object') {
      return {}
    }

    return Object.fromEntries(
      Object.entries(parsedPreferences).map(([key, value]) => [
        key,
        normalizeViewMode(value),
      ]),
    )
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Bookloom] Unable to load collection preferences.', error)
    }

    return {}
  }
}

export function saveCollectionViewMode(namespace, viewMode) {
  if (!canUseLocalStorage()) {
    return false
  }

  try {
    const preferences = loadCollectionPreferences()
    window.localStorage.setItem(
      COLLECTION_PREFERENCES_KEY,
      JSON.stringify({
        ...preferences,
        [`${namespace}ViewMode`]: normalizeViewMode(viewMode),
      }),
    )
    return true
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Bookloom] Unable to save collection preferences.', error)
    }

    return false
  }
}
