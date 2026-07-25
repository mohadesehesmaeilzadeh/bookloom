import { restoreModes } from '../../constants/restoreModes'

function RestoreModeSelector({ restoreMode, onChange }) {
  return (
    <fieldset className="restore-mode-selector">
      <legend>روش بازیابی</legend>
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
