import { useEffect, useState } from 'react'

function BookNotesSection({ notes = '', onSave }) {
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
          <h3 id="book-notes-title">یادداشت‌های من</h3>
          <p>یادداشت‌های عمومی و شخصی درباره این کتاب.</p>
        </div>
        {!isEditing ? (
          <button className="button button-secondary" type="button" onClick={() => setIsEditing(true)}>
            ویرایش یادداشت‌ها
          </button>
        ) : null}
      </div>

      {isEditing ? (
        <div className="book-form">
          <label className="form-field">
            <span>متن یادداشت‌ها</span>
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
              انصراف
            </button>
            <button className="button button-primary" type="button" onClick={handleSave}>
              ذخیره یادداشت‌ها
            </button>
          </div>
        </div>
      ) : notes ? (
        <p className="preserved-text">{notes}</p>
      ) : (
        <div className="soft-empty-state">
          هنوز یادداشتی برای این کتاب ثبت نشده است.
        </div>
      )}
    </section>
  )
}

export default BookNotesSection
