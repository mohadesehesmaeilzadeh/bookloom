import { ALL_FILTER_VALUE, getCategoryOptions } from '../../utils/bookFilters'
import { getBookPriorities } from '../../constants/bookPriorities'
import { BOOK_STATUS, getBookStatuses } from '../../constants/bookStatuses'
import { getViewModes } from '../../constants/viewModes'
import { usePreferences } from '../../context/usePreferences'
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
  resultLabel,
  searchPlaceholder,
  sortOptions,
}) {
  const { language, t } = usePreferences()
  const categoryOptions = getCategoryOptions(books)
  const bookPriorities = getBookPriorities(language.value)
  const bookStatuses = getBookStatuses(language.value)
  const viewModes = getViewModes(language.value)
  const localizedResultLabel = resultLabel ?? t('common.book')
  const localizedSearchPlaceholder = searchPlaceholder ?? t('collection.searchPlaceholder')
  const hasCategoryFilter = enabledFilters.includes('category') && categoryOptions.length > 0
  const resultText =
    controls.visibleCount === controls.totalCount
      ? t('collection.resultCount', {
          count: formatNumber(controls.totalCount),
          label: localizedResultLabel,
        })
      : t('collection.visibleResultCount', {
          total: formatNumber(controls.totalCount),
          visible: formatNumber(controls.visibleCount),
          label: localizedResultLabel,
        })

  return (
    <div className="collection-toolbar">
      <div className="toolbar-search">
        <label className="form-field">
          <span>{t('collection.searchLabel')}</span>
          <input
            placeholder={localizedSearchPlaceholder}
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
            {t('common.clearSearch')}
          </button>
        ) : null}
      </div>

      <div className="toolbar-controls">
        {hasCategoryFilter ? (
          <label className="form-field">
            <span>{t('bookFields.category')}</span>
            <select
              value={controls.filters.category}
              onChange={(event) => controls.setFilter('category', event.target.value)}
            >
              <option value={ALL_FILTER_VALUE}>{t('collection.allCategories')}</option>
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
            <span>{t('bookFields.status')}</span>
            <select
              value={controls.filters.status}
              onChange={(event) => controls.setFilter('status', event.target.value)}
            >
              <option value={ALL_FILTER_VALUE}>{t('collection.allStatuses')}</option>
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
            <span>{t('bookFields.priority')}</span>
            <select
              value={controls.filters.priority}
              onChange={(event) => controls.setFilter('priority', event.target.value)}
            >
              <option value={ALL_FILTER_VALUE}>{t('collection.allPriorities')}</option>
              {bookPriorities.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="form-field">
          <span>{t('collection.sortLabel')}</span>
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
          {controls.visibleCount === 0 ? t('common.noBooksFound') : resultText}
        </p>
        <div className="view-mode-toggle" aria-label={t('collection.viewModeLabel')}>
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
          {t('common.clearSearchFilters')}
        </button>
      </div>
    </div>
  )
}

export default BookCollectionToolbar
