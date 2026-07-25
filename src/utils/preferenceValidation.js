import { accentColorValues } from '../constants/accentColors'
import { DEFAULT_PREFERENCES, preferenceKeys } from '../constants/defaultPreferences'
import { startPageValues } from '../constants/startPageOptions'
import { themeValues } from '../constants/themeOptions'
import { viewModeValues } from '../constants/viewModes'

const preferenceKeySet = new Set(preferenceKeys)
const dangerousKeys = new Set(['__proto__', 'constructor', 'prototype'])

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function normalizeBoolean(value, fallback) {
  if (typeof value === 'boolean') {
    return value
  }

  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  return fallback
}

function sanitizePreferenceRecord(value) {
  if (!isRecord(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      ([key]) => preferenceKeySet.has(key) && !dangerousKeys.has(key),
    ),
  )
}

export function isValidTheme(value) {
  return themeValues.includes(value)
}

export function isValidAccentColor(value) {
  return accentColorValues.includes(value)
}

export function isValidStartPage(value) {
  return startPageValues.includes(value)
}

export function isValidViewMode(value) {
  return viewModeValues.includes(value)
}

export function normalizePreferences(value, options = {}) {
  const fallback = options.fillDefaults === false ? {} : DEFAULT_PREFERENCES
  const source = sanitizePreferenceRecord(value)
  const normalized = { ...fallback }

  if ('theme' in source) {
    normalized.theme = isValidTheme(source.theme) ? source.theme : DEFAULT_PREFERENCES.theme
  }

  if ('accentColor' in source) {
    normalized.accentColor = isValidAccentColor(source.accentColor)
      ? source.accentColor
      : DEFAULT_PREFERENCES.accentColor
  }

  if ('defaultStartPage' in source) {
    normalized.defaultStartPage = isValidStartPage(source.defaultStartPage)
      ? source.defaultStartPage
      : DEFAULT_PREFERENCES.defaultStartPage
  }

  if ('usePersianDigits' in source) {
    normalized.usePersianDigits = normalizeBoolean(
      source.usePersianDigits,
      DEFAULT_PREFERENCES.usePersianDigits,
    )
  }

  if ('confirmBeforeDelete' in source) {
    normalized.confirmBeforeDelete = normalizeBoolean(
      source.confirmBeforeDelete,
      DEFAULT_PREFERENCES.confirmBeforeDelete,
    )
  }

  for (const key of ['libraryViewMode', 'readingViewMode', 'wishlistViewMode', 'finishedViewMode']) {
    if (key in source) {
      normalized[key] = isValidViewMode(source[key])
        ? source[key]
        : DEFAULT_PREFERENCES[key]
    }
  }

  return normalized
}

export function normalizePreferencePatch(value) {
  return normalizePreferences(value, { fillDefaults: false })
}
