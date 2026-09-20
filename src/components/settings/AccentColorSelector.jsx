import { getAccentColorOptions } from '../../constants/accentColors'
import { usePreferences } from '../../context/usePreferences'

function AccentColorSelector({ selectedAccentColor, onChange }) {
  const { language, t } = usePreferences()
  const accentColorOptions = getAccentColorOptions(language.value)

  return (
    <fieldset className="settings-option-group">
      <legend>{t('settings.accentLegend')}</legend>
      <div className="accent-color-grid">
        {accentColorOptions.map((accentColor) => (
          <label className="accent-color-option" key={accentColor.value}>
            <input
              checked={selectedAccentColor === accentColor.value}
              name="accent-color"
              type="radio"
              value={accentColor.value}
              onChange={(event) => onChange(event.target.value)}
            />
            <span
              aria-hidden="true"
              className="accent-swatch"
              style={{ backgroundColor: accentColor.cssValue }}
            />
            <strong>{accentColor.label}</strong>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default AccentColorSelector
