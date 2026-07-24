import { useState } from 'react'
import AppLayout from './layouts/AppLayout'
import DashboardPage from './pages/DashboardPage'
import LibraryPage from './pages/LibraryPage'
import { BooksProvider } from './context/BooksProvider'

function App() {
  const [activePage, setActivePage] = useState('dashboard')

  return (
    <BooksProvider>
      <AppLayout activePage={activePage} onNavigate={setActivePage}>
        {activePage === 'library' ? <LibraryPage /> : <DashboardPage />}
      </AppLayout>
    </BooksProvider>
  )
}

export default App
