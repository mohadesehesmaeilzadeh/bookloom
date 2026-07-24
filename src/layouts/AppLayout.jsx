import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'

function AppLayout({ children }) {
  return (
    <div className="app-shell" dir="rtl">
      <Sidebar />
      <div className="app-content">
        <Header />
        <main className="app-main">{children}</main>
      </div>
    </div>
  )
}

export default AppLayout
