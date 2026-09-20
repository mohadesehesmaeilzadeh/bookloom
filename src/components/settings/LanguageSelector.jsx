import { languageOptions } from '../../i18n/localization'
import { usePreferences } from '../../context/usePreferences'

function LanguageSelector({ selectedLanguage, onChange }) {
  const { t } = usePreferences()

  return (
    <fieldset className="settings-option-group">
      <legend>{t('settings.languageLegend')}</legend>
      <div className="option-card-grid">
        {languageOptions.map((language) => (
          <label className="option-card" key={language.value}>
            <input
              checked={selectedLanguage === language.value}
              name="language"
              type="radio"
              value={language.value}
              onChange={(event) => onChange(event.target.value)}
            />
            <span>
              <strong>{language.label}</strong>
              {t(`settings.language.${language.value}Description`)}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default LanguageSelector
