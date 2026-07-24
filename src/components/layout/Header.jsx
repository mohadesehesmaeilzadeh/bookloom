import { matchPath, useLocation } from 'react-router-dom'
import { routeTitles } from '../../constants/routes'

function Header() {
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
      <div>
        <p className="header-eyebrow">{heading.eyebrow}</p>
        <h1>{heading.title}</h1>
      </div>
      <p className="header-note">مدیریت آرام و آفلاین کتاب‌های شخصی</p>
    </header>
  )
}

export default Header
