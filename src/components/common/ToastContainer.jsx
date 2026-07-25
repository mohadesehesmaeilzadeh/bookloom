import { useEffect } from 'react'

function ToastItem({ onDismiss, toast }) {
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
        aria-label="بستن پیام"
        className="button button-ghost"
        type="button"
        onClick={() => onDismiss(toast.id)}
      >
        بستن
      </button>
    </li>
  )
}

function ToastContainer({ onDismiss, toasts }) {
  if (toasts.length === 0) {
    return null
  }

  return (
    <ol className="toast-container" aria-label="پیام‌های برنامه">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </ol>
  )
}

export default ToastContainer
