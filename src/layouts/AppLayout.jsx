import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'

function AppLayout({ activePage, children, onNavigate }) {
  return (
    <div className="app-shell" dir="rtl">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="app-content">
        <Header activePage={activePage} />
        <main className="app-main">{children}</main>
      </div>
    </div>
  )
}

export default AppLayout
