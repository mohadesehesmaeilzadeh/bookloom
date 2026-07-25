import { Component } from 'react'

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
        <main className="app-error-boundary" dir="rtl">
          <section className="empty-state">
            <h1>مشکلی در نمایش Bookloom پیش آمد.</h1>
            <p>
              اطلاعات ذخیره‌شده حذف نشده‌اند. صفحه را دوباره بارگذاری کن.
            </p>
            <button
              className="button button-primary"
              type="button"
              onClick={() => window.location.reload()}
            >
              بارگذاری دوباره صفحه
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}

export default AppErrorBoundary
