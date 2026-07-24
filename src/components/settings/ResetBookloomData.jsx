import { useState } from 'react'
import Modal from '../common/Modal'

const CONFIRMATION_PHRASE = 'حذف اطلاعات'

function ResetBookloomData({ onExport, onReset }) {
  const [isOpen, setIsOpen] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const canReset = confirmationText.trim() === CONFIRMATION_PHRASE

  function closeModal() {
    setConfirmationText('')
    setIsOpen(false)
  }

  return (
    <section className="settings-section destructive-section" aria-labelledby="reset-data-title">
      <div>
        <h2 id="reset-data-title">بازنشانی اطلاعات Bookloom</h2>
        <p>
          این گزینه تمام کتاب‌ها، اهداف مطالعه و تنظیمات نمایش Bookloom را از این مرورگر حذف
          می‌کند.
        </p>
      </div>
      <div className="settings-card">
        <button className="button button-danger-soft" type="button" onClick={() => setIsOpen(true)}>
          پاک کردن تمام اطلاعات Bookloom
        </button>
      </div>

      <Modal isOpen={isOpen} title="پاک کردن اطلاعات Bookloom" onClose={closeModal}>
        <div className="confirm-dialog reset-dialog">
          <p>پیشنهاد می‌شود پیش از حذف اطلاعات، یک فایل پشتیبان دریافت کنی.</p>
          <button className="button button-secondary" type="button" onClick={onExport}>
            اول فایل پشتیبان بگیر
          </button>
          <label className="form-field">
            <span>برای تأیید عبارت «{CONFIRMATION_PHRASE}» را وارد کن.</span>
            <input
              value={confirmationText}
              onChange={(event) => setConfirmationText(event.target.value)}
            />
          </label>
          <div className="form-actions">
            <button className="button button-secondary" type="button" onClick={closeModal}>
              انصراف
            </button>
            <button
              className="button button-danger"
              disabled={!canReset}
              type="button"
              onClick={() => {
                onReset()
                closeModal()
              }}
            >
              پاک کردن اطلاعات
            </button>
          </div>
        </div>
      </Modal>
    </section>
  )
}

export default ResetBookloomData
