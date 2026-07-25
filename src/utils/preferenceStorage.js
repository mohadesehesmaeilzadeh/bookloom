import { DEFAULT_PREFERENCES } from '../constants/defaultPreferences'
import { STORAGE_KEYS } from '../constants/storageKeys'
import {
  normalizePreferencePatch,
  normalizePreferences,
} from './preferenceValidation'

export const PREFERENCES_STORAGE_KEY = STORAGE_KEYS.preferences
export const LEGACY_COLLECTION_PREFERENCES_KEY = STORAGE_KEYS.collectionPreferences

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readStoredObject(key) {
  if (!canUseLocalStorage()) {
    return {}
  }

  try {
    const rawValue = window.localStorage.getItem(key)

    if (!rawValue) {
      return {}
    }

    const parsedValue = JSON.parse(rawValue)

    return parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue)
      ? parsedValue
      : {}
  } catch {
    return {}
  }
}

export function loadPreferences() {
  const legacyPreferences = normalizePreferencePatch(readStoredObject(LEGACY_COLLECTION_PREFERENCES_KEY))
  const storedPreferences = normalizePreferencePatch(readStoredObject(PREFERENCES_STORAGE_KEY))
  const normalizedPreferences = normalizePreferences({
    ...legacyPreferences,
    ...storedPreferences,
  })

  if (canUseLocalStorage() && Object.keys(storedPreferences).length === 0 && Object.keys(legacyPreferences).length > 0) {
    savePreferences(normalizedPreferences)
  }

  return normalizedPreferences
}

export function savePreferences(preferences) {
  if (!canUseLocalStorage()) {
    return false
  }

  try {
    window.localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify(normalizePreferences(preferences)),
    )
    return true
  } catch {
    return false
  }
}

export function clearPreferences() {
  if (!canUseLocalStorage()) {
    return false
  }

  try {
    window.localStorage.removeItem(PREFERENCES_STORAGE_KEY)
    window.localStorage.removeItem(LEGACY_COLLECTION_PREFERENCES_KEY)
    return true
  } catch {
    return false
  }
}

export function getDefaultPreferences() {
  return { ...DEFAULT_PREFERENCES }
}
