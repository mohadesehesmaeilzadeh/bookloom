import { useEffect, useId, useRef } from 'react'

let openModalCount = 0
let previousBodyOverflow = ''

const focusableSelector = [
  '[data-autofocus]',
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function Modal({ children, isOpen, onClose, title }) {
  const titleId = useId()
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    previousFocusRef.current = document.activeElement

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (openModalCount === 0) {
      previousBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }

    openModalCount += 1
    document.addEventListener('keydown', handleKeyDown)

    window.requestAnimationFrame(() => {
      const focusTarget = dialogRef.current?.querySelector(focusableSelector)
      focusTarget?.focus()
    })

    return () => {
      openModalCount = Math.max(0, openModalCount - 1)

      if (openModalCount === 0) {
        document.body.style.overflow = previousBodyOverflow
      }

      document.removeEventListener('keydown', handleKeyDown)

      if (
        previousFocusRef.current &&
        typeof previousFocusRef.current.focus === 'function'
      ) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className="modal-dialog"
        ref={dialogRef}
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id={titleId}>{title}</h2>
          <button
            aria-label="بستن پنجره"
            className="button button-ghost"
            type="button"
            onClick={onClose}
          >
            بستن
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </section>
    </div>
  )
}

export default Modal
