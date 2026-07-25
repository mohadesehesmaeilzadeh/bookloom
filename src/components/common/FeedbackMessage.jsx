import { useEffect, useRef } from 'react'
import { useToast } from '../../context/useToast'

function FeedbackMessage({ message, onDismiss, type = 'success' }) {
  const { showToast } = useToast()
  const lastMessageRef = useRef('')

  useEffect(() => {
    if (!message || lastMessageRef.current === message) {
      return undefined
    }

    lastMessageRef.current = message
    showToast({ message, type })
  }, [message, showToast, type])

  useEffect(() => {
    if (!message) {
      lastMessageRef.current = ''
      return undefined
    }

    const clearMessageId = window.setTimeout(() => {
      onDismiss?.()
    }, 0)

    return () => window.clearTimeout(clearMessageId)
  }, [message, onDismiss])

  return null
}

export default FeedbackMessage
