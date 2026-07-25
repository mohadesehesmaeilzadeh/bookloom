import { themeOptions } from '../../constants/themeOptions'

function ThemeSelector({ selectedTheme, onChange }) {
  return (
    <fieldset className="settings-option-group">
      <legend>تم برنامه</legend>
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
