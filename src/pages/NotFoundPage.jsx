import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { usePreferences } from '../context/usePreferences'

function NotFoundPage() {
  const { t } = usePreferences()

  return (
    <section className="placeholder-page" aria-labelledby="not-found-title">
      <h2 id="not-found-title">{t('app.notFound.title')}</h2>
      <p>{t('app.notFound.description')}</p>
      <Link className="button button-primary" to={ROUTES.DASHBOARD}>
        {t('app.notFound.back')}
      </Link>
    </section>
  )
}

export default NotFoundPage
