import { getThemeOptions } from '../../constants/themeOptions'
import { usePreferences } from '../../context/usePreferences'

function ThemeSelector({ selectedTheme, onChange }) {
  const { language, t } = usePreferences()
  const themeOptions = getThemeOptions(language.value)

  return (
    <fieldset className="settings-option-group">
      <legend>{t('settings.themeLegend')}</legend>
      <div className="option-card-grid">
        {themeOptions.map((theme) => (
          <label className="option-card" key={theme.value}>
            <input
              checked={selectedTheme === theme.value}
              name="theme"
              type="radio"
              value={theme.value}
              onChange={(event) => onChange(event.target.value)}
            />
            <span>
              <strong>{theme.label}</strong>
              {theme.description}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default ThemeSelector
