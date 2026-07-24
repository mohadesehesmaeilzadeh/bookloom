import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from './constants/routes'
import { BooksProvider } from './context/BooksProvider'
import AppLayout from './layouts/AppLayout'
import BookDetailsPage from './pages/BookDetailsPage'
import DashboardPage from './pages/DashboardPage'
import FinishedPage from './pages/FinishedPage'
import LibraryPage from './pages/LibraryPage'
import NotFoundPage from './pages/NotFoundPage'
import ReadingPage from './pages/ReadingPage'
import SettingsPage from './pages/SettingsPage'
import StatisticsPage from './pages/StatisticsPage'
import WishlistPage from './pages/WishlistPage'

function App() {
  return (
    <BooksProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path={ROUTES.LIBRARY} element={<LibraryPage />} />
            <Route path={ROUTES.READING} element={<ReadingPage />} />
            <Route path={ROUTES.WISHLIST} element={<WishlistPage />} />
            <Route path={ROUTES.FINISHED} element={<FinishedPage />} />
            <Route path={ROUTES.STATISTICS} element={<StatisticsPage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
            <Route path={ROUTES.BOOK_DETAILS} element={<BookDetailsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BooksProvider>
  )
}

export default App
