import { navigationItems } from '../../constants/navigation'

function Sidebar() {
  return (
    <aside className="app-sidebar" aria-label="ناوبری اصلی">
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
          <a
            key={item.id}
            className={`sidebar-link${item.id === 'dashboard' ? ' is-active' : ''}`}
            href={item.path}
            aria-current={item.id === 'dashboard' ? 'page' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
