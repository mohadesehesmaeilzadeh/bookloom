import { DEFAULT_VIEW_MODE, viewModeValues } from '../constants/viewModes'
import { STORAGE_KEYS } from '../constants/storageKeys'

export const COLLECTION_PREFERENCES_KEY = STORAGE_KEYS.collectionPreferences
const allowedPreferenceKeys = new Set([
  'libraryViewMode',
  'readingViewMode',
  'wishlistViewMode',
  'finishedViewMode',
])

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function normalizeViewMode(value) {
  return viewModeValues.includes(value) ? value : DEFAULT_VIEW_MODE
}

export function normalizeCollectionPreferences(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => allowedPreferenceKeys.has(key))
      .map(([key, viewMode]) => [key, normalizeViewMode(viewMode)]),
  )
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

    return normalizeCollectionPreferences(parsedPreferences)
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Bookloom] Unable to load collection preferences.', error)
    }

    return {}
  }
}

export function saveCollectionPreferences(preferences) {
  if (!canUseLocalStorage()) {
    return false
  }

  try {
    window.localStorage.setItem(
      COLLECTION_PREFERENCES_KEY,
      JSON.stringify(normalizeCollectionPreferences(preferences)),
    )
    return true
  } catch {
    return false
  }
}

export function clearCollectionPreferences() {
  if (!canUseLocalStorage()) {
    return false
  }

  try {
    window.localStorage.removeItem(COLLECTION_PREFERENCES_KEY)
    return true
  } catch {
    return false
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
