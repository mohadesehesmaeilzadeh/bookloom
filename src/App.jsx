import AppLayout from './layouts/AppLayout'
import DashboardPage from './pages/DashboardPage'
import { BooksProvider } from './context/BooksProvider'

function App() {
  return (
    <BooksProvider>
      <AppLayout>
        <DashboardPage />
      </AppLayout>
    </BooksProvider>
  )
}

export default App
