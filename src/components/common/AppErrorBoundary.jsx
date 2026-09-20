import { Component } from 'react'
import { t } from '../../i18n/localization'

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('[Bookloom] Application error boundary caught an error.', error, info)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-error-boundary" dir={document.documentElement.dir || 'rtl'}>
          <section className="empty-state">
            <h1>{t('errorBoundary.title')}</h1>
            <p>
              {t('errorBoundary.description')}
            </p>
            <button
              className="button button-primary"
              type="button"
              onClick={() => window.location.reload()}
            >
              {t('errorBoundary.reload')}
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}

export default AppErrorBoundary
