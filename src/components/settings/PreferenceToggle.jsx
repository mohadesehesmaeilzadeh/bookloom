function PreferenceToggle({ checked, description, label, onChange }) {
  return (
    <label className="preference-toggle">
      <input
        checked={checked}
        type="checkbox"
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>
        <strong>{label}</strong>
        {description}
      </span>
    </label>
  )
}

export default PreferenceToggle
