import { LANGUAGE, languageOptions } from '../../i18n/localization'
import { usePreferences } from '../../context/usePreferences'

function LanguageToggle() {
  const { language, t, updatePreferences } = usePreferences()

  function handleLanguageChange(nextLanguage) {
    if (nextLanguage === language.value) {
      return
    }

    updatePreferences({
      language: nextLanguage,
      usePersianDigits: nextLanguage === LANGUAGE.FA,
    })
  }

  return (
    <div
      aria-label={t('header.languageSwitcher')}
      className="language-toggle"
      dir="ltr"
      role="group"
    >
      {languageOptions.map((option) => (
        <button
          aria-pressed={language.value === option.value}
          className="language-toggle-button"
          key={option.value}
          title={option.label}
          type="button"
          onClick={() => handleLanguageChange(option.value)}
        >
          {option.value.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export default LanguageToggle
