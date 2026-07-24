import { useEffect } from 'react'

function FeedbackMessage({ message, onDismiss }) {
  useEffect(() => {
    if (!message) {
      return undefined
    }

    const timeoutId = window.setTimeout(onDismiss, 3200)

    return () => window.clearTimeout(timeoutId)
  }, [message, onDismiss])

  if (!message) {
    return null
  }

  return (
    <div className="feedback-message" role="status">
      <span>{message}</span>
      <button className="button button-ghost" type="button" onClick={onDismiss}>
        بستن
      </button>
    </div>
  )
}

export default FeedbackMessage
