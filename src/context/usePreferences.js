import { useContext } from 'react'
import { PreferencesContext } from './PreferencesContext'

export function usePreferences() {
  const context = useContext(PreferencesContext)

  if (!context) {
    throw new Error('usePreferences must be used inside a PreferencesProvider.')
  }

  return context
}
