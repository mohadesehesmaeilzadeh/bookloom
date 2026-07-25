import { formatDateTime } from '../../utils/dateUtils'
import { formatNumber } from '../../utils/formatNumber'

function BackupPreview({ backup, currentSummary, mergePreview, onCancel, onRestore, restoreMode }) {
  const preview = backup.preview
  const rows = [
    ['تاریخ خروجی فایل', formatDateTime(backup.exportedAt)],
    ['نسخه ساختار', formatNumber(backup.schemaVersion)],
    ['کتاب‌ها', formatNumber(preview.bookCount)],
    ['لیست خرید', formatNumber(preview.wishlistCount)],
    ['تمام‌شده‌ها', formatNumber(preview.finishedCount)],
    ['نقل‌قول‌ها', formatNumber(preview.quoteCount)],
    ['سال‌های دارای هدف مطالعه', formatNumber(preview.readingGoalYearCount)],
    ['تنظیمات نمایش', preview.hasCollectionPreferences ? 'وجود دارد' : 'وجود ندارد'],
  ]

  return (
    <div className="backup-preview">
      <h3>پیش‌نمایش فایل پشتیبان</h3>
      <dl className="backup-summary-grid">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <div className="backup-comparison">
        <h4>مقایسه با اطلاعات فعلی</h4>
        <dl className="backup-summary-grid">
          <div>
            <dt>کتاب‌های فعلی</dt>
            <dd>{formatNumber(currentSummary.bookCount)}</dd>
          </div>
          <div>
            <dt>کتاب‌های فایل</dt>
            <dd>{formatNumber(preview.bookCount)}</dd>
          </div>
          <div>
            <dt>لیست خرید فعلی</dt>
            <dd>{formatNumber(currentSummary.wishlistCount)}</dd>
          </div>
          <div>
            <dt>لیست خرید فایل</dt>
            <dd>{formatNumber(preview.wishlistCount)}</dd>
          </div>
          <div>
            <dt>تمام‌شده‌های فعلی</dt>
            <dd>{formatNumber(currentSummary.finishedCount)}</dd>
          </div>
          <div>
            <dt>تمام‌شده‌های فایل</dt>
            <dd>{formatNumber(preview.finishedCount)}</dd>
          </div>
        </dl>
      </div>

      {restoreMode === 'merge' && mergePreview ? (
        <div className="merge-preview">
          <h4>پیش‌نمایش ادغام</h4>
          <dl className="backup-summary-grid">
            <div>
              <dt>کتاب‌های افزوده‌شونده</dt>
              <dd>{formatNumber(mergePreview.summary.books.added)}</dd>
            </div>
            <div>
              <dt>کتاب‌های به‌روزشونده</dt>
              <dd>{formatNumber(mergePreview.summary.books.updated)}</dd>
            </div>
            <div>
              <dt>کتاب‌های محلی حفظ‌شده</dt>
              <dd>{formatNumber(mergePreview.summary.books.keptLocal)}</dd>
            </div>
            <div>
              <dt>شناسه‌های تکراری حل‌شده</dt>
              <dd>{formatNumber(mergePreview.summary.books.duplicatesResolved)}</dd>
            </div>
          </dl>
        </div>
      ) : null}

      <div className="form-actions">
        <button className="button button-secondary" type="button" onClick={onCancel}>
          انصراف
        </button>
        <button className="button button-primary" type="button" onClick={onRestore}>
          ادامه برای بازیابی
        </button>
      </div>
    </div>
  )
}

export default BackupPreview
