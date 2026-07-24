import { navigationItems } from '../../constants/navigation'

const enabledNavigationItems = new Set(['dashboard', 'library'])

function Sidebar({ activePage, onNavigate }) {
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
        {navigationItems.map((item) => {
          const isEnabled = enabledNavigationItems.has(item.id)
          const isActive = item.id === activePage

          return (
            <button
              aria-current={isActive ? 'page' : undefined}
              className={`sidebar-link${isActive ? ' is-active' : ''}`}
              disabled={!isEnabled}
              key={item.id}
              type="button"
              onClick={() => {
                if (isEnabled) {
                  onNavigate(item.id)
                }
              }}
            >
              {item.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
