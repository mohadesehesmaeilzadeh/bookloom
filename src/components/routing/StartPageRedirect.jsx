import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { usePreferences } from '../../context/usePreferences'
import DashboardPage from '../../pages/DashboardPage'

let hasEvaluatedStartPage = false

function StartPageRedirect() {
  const { preferences } = usePreferences()
  const [isInitialRootEntry] = useState(() => !hasEvaluatedStartPage)

  useEffect(() => {
    hasEvaluatedStartPage = true
  }, [])

  if (
    isInitialRootEntry &&
    preferences.defaultStartPage &&
    preferences.defaultStartPage !== ROUTES.DASHBOARD
  ) {
    return <Navigate replace to={preferences.defaultStartPage} />
  }

  return <DashboardPage />
}

export default StartPageRedirect
