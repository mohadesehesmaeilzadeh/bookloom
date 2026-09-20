import { useCallback, useEffect, useMemo, useState } from 'react'
import { THEME } from '../constants/themeOptions'
import { PreferencesContext } from './PreferencesContext'
import {
  getDefaultPreferences,
  loadPreferences,
  savePreferences,
} from '../utils/preferenceStorage'
import {
  normalizePreferencePatch,
  normalizePreferences,
} from '../utils/preferenceValidation'
import { getLanguageMeta, translate } from '../i18n/localization'

function getSystemTheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return THEME.LIGHT
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEME.DARK
    : THEME.LIGHT
}

function applyRootPreferences(preferences, resolvedTheme) {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  const language = getLanguageMeta(preferences.language)

  root.dataset.theme = resolvedTheme
  root.dataset.accent = preferences.accentColor
  root.dataset.persianDigits = preferences.usePersianDigits ? 'true' : 'false'
  root.dataset.language = language.value
  root.dir = language.dir
  root.lang = language.value
  document.title = translate(language.value, 'app.brand.title')
}

export function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    const initialPreferences = loadPreferences()
    const initialSystemTheme = getSystemTheme()
    const initialTheme = initialPreferences.theme === THEME.SYSTEM
      ? initialSystemTheme
      : initialPreferences.theme

    applyRootPreferences(initialPreferences, initialTheme)

    return initialPreferences
  })
  const [systemTheme, setSystemTheme] = useState(getSystemTheme)
  const resolvedTheme = preferences.theme === THEME.SYSTEM ? systemTheme : preferences.theme
  const language = getLanguageMeta(preferences.language)
  const t = useCallback(
    (key, values) => translate(language.value, key, values),
    [language.value],
  )

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    function handleSystemThemeChange(event) {
      setSystemTheme(event.matches ? THEME.DARK : THEME.LIGHT)
    }

    setSystemTheme(mediaQuery.matches ? THEME.DARK : THEME.LIGHT)

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleSystemThemeChange)

      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }

    mediaQuery.addListener(handleSystemThemeChange)

    return () => mediaQuery.removeListener(handleSystemThemeChange)
  }, [])

  useEffect(() => {
    applyRootPreferences(preferences, resolvedTheme)
  }, [preferences, resolvedTheme])

  const replacePreferences = useCallback((nextPreferences, options = {}) => {
    const normalizedPreferences = normalizePreferences(nextPreferences)
    const persist = options.persist !== false

    if (persist && !savePreferences(normalizedPreferences)) {
      return { preferences: normalizedPreferences, success: false }
    }

    const nextTheme = normalizedPreferences.theme === THEME.SYSTEM
      ? systemTheme
      : normalizedPreferences.theme

    applyRootPreferences(normalizedPreferences, nextTheme)
    setPreferences(normalizedPreferences)

    return { preferences: normalizedPreferences, success: true }
  }, [systemTheme])

  const updatePreferences = useCallback((updates) => {
    const patch = normalizePreferencePatch(updates)
    const nextPreferences = normalizePreferences({
      ...preferences,
      ...patch,
    })

    if (!savePreferences(nextPreferences)) {
      return { preferences: nextPreferences, success: false }
    }

    const nextTheme = nextPreferences.theme === THEME.SYSTEM
      ? systemTheme
      : nextPreferences.theme

    applyRootPreferences(nextPreferences, nextTheme)
    setPreferences(nextPreferences)

    return { preferences: nextPreferences, success: true }
  }, [preferences, systemTheme])

  const updatePreference = useCallback(
    (key, value) => updatePreferences({ [key]: value }),
    [updatePreferences],
  )

  const resetPreferences = useCallback((options = {}) => (
    replacePreferences(getDefaultPreferences(), options)
  ), [replacePreferences])

  const value = useMemo(() => ({
    preferences,
    language,
    replacePreferences,
    resetPreferences,
    resolvedTheme,
    t,
    updatePreference,
    updatePreferences,
  }), [
    language,
    preferences,
    replacePreferences,
    resetPreferences,
    resolvedTheme,
    t,
    updatePreference,
    updatePreferences,
  ])

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  )
}
