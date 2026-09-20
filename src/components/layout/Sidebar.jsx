import { NavLink } from 'react-router-dom'
import { getNavigationItems } from '../../constants/navigation'
import { usePreferences } from '../../context/usePreferences'

function Sidebar({ isOpen = false, onClose }) {
  const { language, t } = usePreferences()
  const navigationItems = getNavigationItems(language.value)

  return (
    <aside
      aria-label={t('sidebar.mainNav')}
      className={`app-sidebar${isOpen ? ' is-open' : ''}`}
      id="app-sidebar"
    >
      <div className="sidebar-brand">
        <span className="brand-mark" aria-hidden="true">
          {t('app.brand.mark')}
        </span>
        <div>
          <p className="brand-title">{t('app.brand.title')}</p>
          <p className="brand-subtitle">{t('app.brand.subtitle')}</p>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label={t('sidebar.sections')}>
        {navigationItems.map((item) => (
          <NavLink
            className={({ isActive }) => `sidebar-link${isActive ? ' is-active' : ''}`}
            end={item.path === '/'}
            key={item.id}
            to={item.path}
            onClick={onClose}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
