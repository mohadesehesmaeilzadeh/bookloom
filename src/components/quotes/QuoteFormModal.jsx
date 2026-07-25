import Modal from '../common/Modal'
import QuoteForm from './QuoteForm'

function QuoteFormModal({ isOpen, mode, onClose, onSubmit, quote }) {
  return (
    <Modal
      isOpen={isOpen}
      title={mode === 'edit' ? 'ویرایش نقل‌قول' : 'افزودن نقل‌قول'}
      onClose={onClose}
    >
      <QuoteForm mode={mode} quote={quote} onCancel={onClose} onSubmit={onSubmit} />
    </Modal>
  )
}

export default QuoteFormModal
