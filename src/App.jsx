import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppErrorBoundary from './components/common/AppErrorBoundary'
import StartPageRedirect from './components/routing/StartPageRedirect'
import { ROUTES } from './constants/routes'
import { BooksProvider } from './context/BooksProvider'
import { PreferencesProvider } from './context/PreferencesProvider'
import { ToastProvider } from './context/ToastProvider'
import AppLayout from './layouts/AppLayout'
import BookDetailsPage from './pages/BookDetailsPage'
import FinishedPage from './pages/FinishedPage'
import LibraryPage from './pages/LibraryPage'
import NotFoundPage from './pages/NotFoundPage'
import ReadingPage from './pages/ReadingPage'
import SettingsPage from './pages/SettingsPage'
import StatisticsPage from './pages/StatisticsPage'
import WishlistPage from './pages/WishlistPage'

function App() {
  return (
    <AppErrorBoundary>
      <PreferencesProvider>
        <ToastProvider>
          <BooksProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route index element={<StartPageRedirect />} />
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
        </ToastProvider>
      </PreferencesProvider>
    </AppErrorBoundary>
  )
}

export default App
