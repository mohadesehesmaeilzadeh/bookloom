import Modal from '../common/Modal'
import { usePreferences } from '../../context/usePreferences'
import QuoteForm from './QuoteForm'

function QuoteFormModal({ isOpen, mode, onClose, onSubmit, quote }) {
  const { t } = usePreferences()

  return (
    <Modal
      isOpen={isOpen}
      title={mode === 'edit' ? t('quotes.edit') : t('quotes.add')}
      onClose={onClose}
    >
      <QuoteForm mode={mode} quote={quote} onCancel={onClose} onSubmit={onSubmit} />
    </Modal>
  )
}

export default QuoteFormModal
