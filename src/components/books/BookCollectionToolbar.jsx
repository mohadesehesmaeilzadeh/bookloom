import { ALL_FILTER_VALUE, getCategoryOptions } from '../../utils/bookFilters'
import { bookPriorities } from '../../constants/bookPriorities'
import { bookStatuses, BOOK_STATUS } from '../../constants/bookStatuses'
import { viewModes } from '../../constants/viewModes'
import { formatNumber } from '../../utils/formatNumber'

const libraryStatuses = [
  BOOK_STATUS.OWNED,
  BOOK_STATUS.READING,
  BOOK_STATUS.PAUSED,
  BOOK_STATUS.FINISHED,
  BOOK_STATUS.ABANDONED,
]

function BookCollectionToolbar({
  books,
  controls,
  enabledFilters = [],
  resultLabel = 'کتاب',
  searchPlaceholder = 'جست‌وجو در نام کتاب، نویسنده، مترجم یا دسته‌بندی',
  sortOptions,
}) {
  const categoryOptions = getCategoryOptions(books)
  const hasCategoryFilter = enabledFilters.includes('category') && categoryOptions.length > 0
  const resultText =
    controls.visibleCount === controls.totalCount
      ? `${formatNumber(controls.totalCount)} ${resultLabel}`
      : `نمایش ${formatNumber(controls.visibleCount)} ${resultLabel} از ${formatNumber(
          controls.totalCount,
        )} ${resultLabel}`

  return (
    <div className="collection-toolbar">
      <div className="toolbar-search">
        <label className="form-field">
          <span>جست‌وجو</span>
          <input
            placeholder={searchPlaceholder}
            type="search"
            value={controls.searchQuery}
            onChange={(event) => controls.setSearchQuery(event.target.value)}
          />
        </label>
        {controls.searchQuery ? (
          <button
            className="button button-ghost"
            type="button"
            onClick={() => controls.setSearchQuery('')}
          >
            پاک کردن جست‌وجو
          </button>
        ) : null}
      </div>

      <div className="toolbar-controls">
        {hasCategoryFilter ? (
          <label className="form-field">
            <span>دسته‌بندی</span>
            <select
              value={controls.filters.category}
              onChange={(event) => controls.setFilter('category', event.target.value)}
            >
              <option value={ALL_FILTER_VALUE}>همه دسته‌بندی‌ها</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {enabledFilters.includes('status') ? (
          <label className="form-field">
            <span>وضعیت</span>
            <select
              value={controls.filters.status}
              onChange={(event) => controls.setFilter('status', event.target.value)}
            >
              <option value={ALL_FILTER_VALUE}>همه وضعیت‌ها</option>
              {bookStatuses
                .filter((status) => libraryStatuses.includes(status.value))
                .map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
            </select>
          </label>
        ) : null}

        {enabledFilters.includes('priority') ? (
          <label className="form-field">
            <span>اولویت</span>
            <select
              value={controls.filters.priority}
              onChange={(event) => controls.setFilter('priority', event.target.value)}
            >
              <option value={ALL_FILTER_VALUE}>همه اولویت‌ها</option>
              {bookPriorities.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="form-field">
          <span>مرتب‌سازی</span>
          <select
            value={controls.sortBy}
            onChange={(event) => controls.setSortBy(event.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="toolbar-footer">
        <p className="result-count" role="status">
          {controls.visibleCount === 0 ? 'هیچ کتابی پیدا نشد' : resultText}
        </p>
        <div className="view-mode-toggle" aria-label="نوع نمایش">
          {viewModes.map((mode) => (
            <button
              aria-pressed={controls.viewMode === mode.value}
              className={`button ${
                controls.viewMode === mode.value ? 'button-primary' : 'button-secondary'
              }`}
              key={mode.value}
              type="button"
              onClick={() => controls.setViewMode(mode.value)}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <button
          className="button button-ghost"
          disabled={!controls.hasActiveControls}
          type="button"
          onClick={controls.clearControls}
        >
          حذف جست‌وجو و فیلترها
        </button>
      </div>
    </div>
  )
}

export default BookCollectionToolbar
