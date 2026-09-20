import { useEffect } from 'react'
import { usePreferences } from '../../context/usePreferences'

function ToastItem({ onDismiss, toast }) {
  const { t } = usePreferences()
  useEffect(() => {
    if (toast.duration === 0) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => onDismiss(toast.id), toast.duration)

    return () => window.clearTimeout(timeoutId)
  }, [onDismiss, toast])

  const role = toast.type === 'error' ? 'alert' : 'status'

  return (
    <li className={`toast toast-${toast.type}`} role={role}>
      <span>{toast.message}</span>
      <button
        aria-label={t('common.closeMessage')}
        className="button button-ghost"
        type="button"
        onClick={() => onDismiss(toast.id)}
      >
        {t('common.close')}
      </button>
    </li>
  )
}

function ToastContainer({ onDismiss, toasts }) {
  const { t } = usePreferences()

  if (toasts.length === 0) {
    return null
  }

  return (
    <ol className="toast-container" aria-label={t('common.toastMessages')}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </ol>
  )
}

export default ToastContainer
