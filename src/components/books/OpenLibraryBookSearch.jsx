import { useEffect, useRef, useState } from 'react'
import { usePreferences } from '../../context/usePreferences'
import {
  OPEN_LIBRARY_SEARCH_TYPES,
  searchOpenLibraryBooks,
} from '../../services/openLibrarySearch'

const searchTypes = [
  OPEN_LIBRARY_SEARCH_TYPES.TITLE,
  OPEN_LIBRARY_SEARCH_TYPES.AUTHOR,
  OPEN_LIBRARY_SEARCH_TYPES.ISBN,
]

function OpenLibraryBookSearch({ onSelectBook }) {
  const { t } = usePreferences()
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState(OPEN_LIBRARY_SEARCH_TYPES.TITLE)
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const abortControllerRef = useRef(null)

  const isLoading = status === 'loading'
  const hasResults = results.length > 0
  const showEmptyState = status === 'success' && !hasResults

  useEffect(() => () => {
    abortControllerRef.current?.abort()
  }, [])

  async function handleSearch(event) {
    event?.preventDefault()

    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setResults([])
      setError('')
      setStatus('idle')
      return
    }

    abortControllerRef.current?.abort()
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    setStatus('loading')
    setError('')

    try {
      const nextResults = await searchOpenLibraryBooks(trimmedQuery, searchType, {
        signal: abortController.signal,
      })

      setResults(nextResults)
      setStatus('success')
    } catch (searchError) {
      if (searchError.name === 'AbortError') {
        return
      }

      setResults([])
      setError(t('openLibrarySearch.error'))
      setStatus('error')
    }
  }

  function handleSelectBook(result) {
    onSelectBook(result.book)
  }

  function handleQueryKeyDown(event) {
    if (event.key === 'Enter') {
      handleSearch(event)
    }
  }

  return (
    <section className="open-library-search" aria-labelledby="open-library-search-title">
      <div className="open-library-search-header">
        <h3 id="open-library-search-title">{t('openLibrarySearch.title')}</h3>
        <p>{t('openLibrarySearch.description')}</p>
      </div>

      <div className="open-library-search-controls">
        <label className="form-field">
          <span>{t('openLibrarySearch.typeLabel')}</span>
          <select
            value={searchType}
            onChange={(event) => setSearchType(event.target.value)}
          >
            {searchTypes.map((type) => (
              <option key={type} value={type}>
                {t(`openLibrarySearch.type.${type}`)}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>{t('openLibrarySearch.queryLabel')}</span>
          <input
            type="search"
            value={query}
            onKeyDown={handleQueryKeyDown}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <button
          className="button button-secondary"
          disabled={isLoading || !query.trim()}
          type="button"
          onClick={handleSearch}
        >
          {isLoading ? t('openLibrarySearch.loading') : t('openLibrarySearch.search')}
        </button>
      </div>

      {error ? (
        <p className="open-library-search-message open-library-search-error">
          {error}
        </p>
      ) : null}

      {showEmptyState ? (
        <p className="open-library-search-message">{t('openLibrarySearch.empty')}</p>
      ) : null}

      {hasResults ? (
        <ul className="open-library-results">
          {results.map((result) => (
            <li key={result.id}>
              <button
                className="open-library-result"
                type="button"
                onClick={() => handleSelectBook(result)}
              >
                {result.coverUrl ? (
                  <img alt="" src={result.coverUrl} />
                ) : (
                  <span className="open-library-cover-placeholder" aria-hidden="true" />
                )}
                <span>
                  <strong>{result.title}</strong>
                  <span>{result.author || t('openLibrarySearch.unknownAuthor')}</span>
                  <span>
                    {result.publishYear
                      ? t('openLibrarySearch.publishYear', {
                          year: result.publishYear,
                        })
                      : t('openLibrarySearch.unknownPublishYear')}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

export default OpenLibraryBookSearch
