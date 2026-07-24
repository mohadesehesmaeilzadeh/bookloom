const pageHeadings = {
  dashboard: {
    eyebrow: 'نمای کلی',
    title: 'داشبورد',
  },
  library: {
    eyebrow: 'کتاب‌ها',
    title: 'کتابخانه من',
  },
}

function Header({ activePage }) {
  const heading = pageHeadings[activePage] ?? pageHeadings.dashboard

  return (
    <header className="app-header">
      <div>
        <p className="header-eyebrow">{heading.eyebrow}</p>
        <h1>{heading.title}</h1>
      </div>
      <p className="header-note">مدیریت آرام و آفلاین کتاب‌های شخصی</p>
    </header>
  )
}

export default Header
