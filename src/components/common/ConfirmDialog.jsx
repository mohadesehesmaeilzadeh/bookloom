import Modal from './Modal'

function ConfirmDialog({
  cancelLabel = 'انصراف',
  confirmLabel,
  isConfirming = false,
  isOpen,
  message,
  onCancel,
  onConfirm,
  title,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="confirm-dialog">
        <p>{message}</p>
        <div className="form-actions">
          <button className="button button-secondary" data-autofocus type="button" onClick={onCancel}>
            {cancelLabel}
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
