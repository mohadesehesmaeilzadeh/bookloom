import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'

function AppLayout() {
  return (
    <div className="app-shell" dir="rtl">
      <Sidebar />
      <div className="app-content">
        <Header />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
