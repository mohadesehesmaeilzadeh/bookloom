import { getStartPageOptions } from '../../constants/startPageOptions'
import { usePreferences } from '../../context/usePreferences'

function StartPageSelector({ selectedStartPage, onChange }) {
  const { language, t } = usePreferences()
  const startPageOptions = getStartPageOptions(language.value)

  return (
    <label className="form-field">
      <span>{t('settings.startPageLabel')}</span>
      <select
        value={selectedStartPage}
        onChange={(event) => onChange(event.target.value)}
      >
        {startPageOptions.map((page) => (
          <option key={page.value} value={page.value}>
            {page.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default StartPageSelector
