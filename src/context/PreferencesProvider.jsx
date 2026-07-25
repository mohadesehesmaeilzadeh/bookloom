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
  root.dataset.theme = resolvedTheme
  root.dataset.accent = preferences.accentColor
  root.dataset.persianDigits = preferences.usePersianDigits ? 'true' : 'false'
}

export function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(loadPreferences)
  const [systemTheme, setSystemTheme] = useState(getSystemTheme)
  const resolvedTheme = preferences.theme === THEME.SYSTEM ? systemTheme : preferences.theme

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

    setPreferences(normalizedPreferences)

    return { preferences: normalizedPreferences, success: true }
  }, [])

  const updatePreferences = useCallback((updates) => {
    const patch = normalizePreferencePatch(updates)
    const nextPreferences = normalizePreferences({
      ...preferences,
      ...patch,
    })

    if (!savePreferences(nextPreferences)) {
      return { preferences: nextPreferences, success: false }
    }

    setPreferences(nextPreferences)

    return { preferences: nextPreferences, success: true }
  }, [preferences])

  const updatePreference = useCallback(
    (key, value) => updatePreferences({ [key]: value }),
    [updatePreferences],
  )

  const resetPreferences = useCallback((options = {}) => (
    replacePreferences(getDefaultPreferences(), options)
  ), [replacePreferences])

  const value = useMemo(() => ({
    preferences,
    replacePreferences,
    resetPreferences,
    resolvedTheme,
    updatePreference,
    updatePreferences,
  }), [
    preferences,
    replacePreferences,
    resetPreferences,
    resolvedTheme,
    updatePreference,
    updatePreferences,
  ])

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  )
}
