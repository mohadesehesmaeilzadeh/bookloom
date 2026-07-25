import { NavLink } from 'react-router-dom'
import { navigationItems } from '../../constants/navigation'

function Sidebar({ isOpen = false, onClose }) {
  return (
    <aside
      aria-label="ناوبری اصلی"
      className={`app-sidebar${isOpen ? ' is-open' : ''}`}
      id="app-sidebar"
    >
      <div className="sidebar-brand">
        <span className="brand-mark" aria-hidden="true">
          ب
        </span>
        <div>
          <p className="brand-title">بوک‌لوم</p>
          <p className="brand-subtitle">کتابخانه شخصی</p>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="بخش‌های برنامه">
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
