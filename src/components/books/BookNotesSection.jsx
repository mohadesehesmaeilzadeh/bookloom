import { useEffect, useState } from 'react'
import { usePreferences } from '../../context/usePreferences'

function BookNotesSection({ notes = '', onSave }) {
  const { t } = usePreferences()
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(notes)

  useEffect(() => {
    if (!isEditing) {
      setValue(notes)
    }
  }, [isEditing, notes])

  function handleSave() {
    onSave(value.trim())
    setIsEditing(false)
  }

  return (
    <section className="details-section editable-text-section" aria-labelledby="book-notes-title">
      <div className="dashboard-item-header">
        <div>
          <h3 id="book-notes-title">{t('notes.title')}</h3>
          <p>{t('notes.description')}</p>
        </div>
        {!isEditing ? (
          <button className="button button-secondary" type="button" onClick={() => setIsEditing(true)}>
            {t(notes ? 'notes.edit' : 'notes.add')}
          </button>
        ) : null}
      </div>

      {isEditing ? (
        <div className="book-form">
          <label className="form-field">
            <span>{t('notes.textLabel')}</span>
            <textarea value={value} onChange={(event) => setValue(event.target.value)} />
          </label>
          <div className="form-actions">
            <button
              className="button button-secondary"
              type="button"
              onClick={() => {
                setValue(notes)
                setIsEditing(false)
              }}
            >
              {t('common.cancel')}
            </button>
            <button className="button button-primary" type="button" onClick={handleSave}>
              {t('notes.save')}
            </button>
          </div>
        </div>
      ) : notes ? (
        <p className="preserved-text">{notes}</p>
      ) : (
        <div className="soft-empty-state">
          {t('notes.empty')}
        </div>
      )}
    </section>
  )
}

export default BookNotesSection
