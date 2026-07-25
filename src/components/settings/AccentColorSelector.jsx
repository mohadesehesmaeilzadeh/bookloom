import { accentColorOptions } from '../../constants/accentColors'

function AccentColorSelector({ selectedAccentColor, onChange }) {
  return (
    <fieldset className="settings-option-group">
      <legend>رنگ اصلی</legend>
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
