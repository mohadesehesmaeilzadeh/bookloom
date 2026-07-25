import { startPageOptions } from '../../constants/startPageOptions'

function StartPageSelector({ selectedStartPage, onChange }) {
  return (
    <label className="form-field">
      <span>صفحه شروع برنامه</span>
      <select
        value={selectedStartPage}
        onChange={(event) => onChange(event.target.value)}
      >
        {startPageOptions.map((page) => (
          <option key={page.value} value={page.value}>
            {page.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default StartPageSelector
