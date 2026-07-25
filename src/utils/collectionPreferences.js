import { STORAGE_KEYS } from '../constants/storageKeys'
import { DEFAULT_PREFERENCES } from '../constants/defaultPreferences'
import {
  clearPreferences,
  loadPreferences,
  savePreferences,
} from './preferenceStorage'
import { normalizePreferences } from './preferenceValidation'

export const COLLECTION_PREFERENCES_KEY = STORAGE_KEYS.collectionPreferences

const collectionPreferenceKeys = [
  'libraryViewMode',
  'readingViewMode',
  'wishlistViewMode',
  'finishedViewMode',
]

export function normalizeCollectionPreferences(value) {
  const normalizedPreferences = normalizePreferences(value, { fillDefaults: false })

  return Object.fromEntries(
    collectionPreferenceKeys
      .filter((key) => Object.prototype.hasOwnProperty.call(normalizedPreferences, key))
      .map((key) => [key, normalizedPreferences[key]]),
  )
}

export function loadCollectionPreferences() {
  const preferences = loadPreferences()

  return Object.fromEntries(
    collectionPreferenceKeys.map((key) => [
      key,
      preferences[key] ?? DEFAULT_PREFERENCES[key],
    ]),
  )
}

export function saveCollectionPreferences(preferences) {
  const collectionPreferences = normalizeCollectionPreferences(preferences)

  return savePreferences({
    ...loadPreferences(),
    ...collectionPreferences,
  })
}

export function clearCollectionPreferences() {
  return clearPreferences()
}

export function saveCollectionViewMode(namespace, viewMode) {
  const key = `${namespace}ViewMode`

  if (!collectionPreferenceKeys.includes(key)) {
    return false
  }

  return savePreferences({
    ...loadPreferences(),
    [key]: viewMode,
  })
}
