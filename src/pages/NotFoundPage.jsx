import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

function NotFoundPage() {
  return (
    <section className="placeholder-page" aria-labelledby="not-found-title">
      <h2 id="not-found-title">صفحه پیدا نشد</h2>
      <p>آدرسی که باز کرده‌اید در Bookloom وجود ندارد.</p>
      <Link className="button button-primary" to={ROUTES.DASHBOARD}>
        بازگشت به داشبورد
      </Link>
    </section>
  )
}

export default NotFoundPage
