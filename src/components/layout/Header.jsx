import { matchPath, useLocation } from 'react-router-dom'
import { routeTitles } from '../../constants/routes'

function Header({ isSidebarOpen = false, onMenuClick }) {
  const location = useLocation()
  const heading =
    routeTitles.find((route) =>
      matchPath({ path: route.path, end: route.end ?? true }, location.pathname),
    ) ?? {
      eyebrow: 'ناوبری',
      title: 'صفحه پیدا نشد',
    }

  return (
    <header className="app-header">
      <div className="header-title-group">
        <button
          aria-controls="app-sidebar"
          aria-expanded={isSidebarOpen}
          aria-label="باز کردن منوی ناوبری"
          className="button button-secondary mobile-menu-button"
          type="button"
          onClick={onMenuClick}
        >
          منو
        </button>
        <div>
          <p className="header-eyebrow">{heading.eyebrow}</p>
          <h1>{heading.title}</h1>
        </div>
      </div>
      <p className="header-note">مدیریت آرام و آفلاین کتاب‌های شخصی</p>
    </header>
  )
}

export default Header
