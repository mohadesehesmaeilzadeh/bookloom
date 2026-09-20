import Modal from './Modal'
import { usePreferences } from '../../context/usePreferences'

function ConfirmDialog({
  cancelLabel,
  confirmLabel,
  isConfirming = false,
  isOpen,
  message,
  onCancel,
  onConfirm,
  title,
}) {
  const { t } = usePreferences()

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="confirm-dialog">
        <p>{message}</p>
        <div className="form-actions">
          <button className="button button-secondary" data-autofocus type="button" onClick={onCancel}>
            {cancelLabel ?? t('common.cancel')}
          </button>
          <button
            className="button button-danger"
            disabled={isConfirming}
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
