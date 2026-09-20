import { getRestoreModes } from '../../constants/restoreModes'
import { usePreferences } from '../../context/usePreferences'

function RestoreModeSelector({ restoreMode, onChange }) {
  const { language, t } = usePreferences()
  const restoreModes = getRestoreModes(language.value)

  return (
    <fieldset className="restore-mode-selector">
      <legend>{t('settings.restoreModeLegend')}</legend>
      {restoreModes.map((mode) => (
        <label className="restore-mode-option" key={mode.value}>
          <input
            checked={restoreMode === mode.value}
            name="restore-mode"
            type="radio"
            value={mode.value}
            onChange={(event) => onChange(event.target.value)}
          />
          <span>
            <strong>{mode.label}</strong>
            {mode.description}
          </span>
        </label>
      ))}
    </fieldset>
  )
}

export default RestoreModeSelector
