import { matchPath, useLocation } from 'react-router-dom'
import { getRouteTitles } from '../../constants/routes'
import { usePreferences } from '../../context/usePreferences'
import LanguageToggle from './LanguageToggle'

function Header({ isSidebarOpen = false, onMenuClick }) {
  const location = useLocation()
  const { language, t } = usePreferences()
  const routeTitles = getRouteTitles(language.value)
  const heading =
    routeTitles.find((route) =>
      matchPath({ path: route.path, end: route.end ?? true }, location.pathname),
    ) ?? {
      eyebrow: t('app.navigation'),
      title: t('app.notFound.title'),
    }

  return (
    <header className="app-header">
      <div className="header-title-group">
        <button
          aria-controls="app-sidebar"
          aria-expanded={isSidebarOpen}
          aria-label={t('header.openMenu')}
          className="button button-secondary mobile-menu-button"
          type="button"
          onClick={onMenuClick}
        >
          <span aria-hidden="true" className="mobile-menu-icon">☰</span>
          <span className="mobile-menu-label">{t('header.menu')}</span>
        </button>
        <div>
          <p className="header-eyebrow">{heading.eyebrow}</p>
          <h1>{heading.title}</h1>
        </div>
      </div>
      <div className="header-actions">
        <p className="header-note">{t('app.header.note')}</p>
        <LanguageToggle />
      </div>
    </header>
  )
}

export default Header
