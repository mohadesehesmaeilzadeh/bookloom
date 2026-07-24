import { formatNumber } from '../../utils/formatNumber'

function BackupExportSection({ bookCount, onExport }) {
  return (
    <section className="settings-section" aria-labelledby="backup-export-title">
      <div>
        <h2 id="backup-export-title">پشتیبان‌گیری از اطلاعات</h2>
        <p>
          با دریافت فایل پشتیبان می‌توانی اطلاعات کتاب‌ها، اهداف مطالعه و تنظیمات نمایش را
          برای بازیابی در آینده ذخیره کنی.
        </p>
      </div>
      <div className="settings-card">
        <p>{formatNumber(bookCount)} کتاب در فایل پشتیبان قرار می‌گیرد.</p>
        <button className="button button-primary" type="button" onClick={onExport}>
          دریافت فایل پشتیبان JSON
        </button>
      </div>
    </section>
  )
}

export default BackupExportSection
