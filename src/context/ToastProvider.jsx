import { useCallback, useMemo, useState } from 'react'
import ToastContainer from '../components/common/ToastContainer'
import { generateId } from '../utils/generateId'
import { ToastContext } from './ToastContext'

const DEFAULT_TOAST_DURATION = 3600

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismissToast = useCallback((toastId) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId),
    )
  }, [])

  const showToast = useCallback((toast) => {
    const id = generateId()
    const nextToast = {
      id,
      duration: toast.duration ?? DEFAULT_TOAST_DURATION,
      message: toast.message,
      type: toast.type ?? 'success',
    }

    setToasts((currentToasts) => [nextToast, ...currentToasts].slice(0, 4))

    return id
  }, [])

  const value = useMemo(() => ({
    dismissToast,
    showToast,
    toasts,
  }), [dismissToast, showToast, toasts])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer onDismiss={dismissToast} toasts={toasts} />
    </ToastContext.Provider>
  )
}
