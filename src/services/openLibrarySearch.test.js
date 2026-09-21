import { afterEach, describe, expect, it, vi } from 'vitest'
import { OPEN_LIBRARY_SEARCH_TYPES, searchOpenLibraryBooks } from './openLibrarySearch'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('searchOpenLibraryBooks', () => {
  it.each([
    [OPEN_LIBRARY_SEARCH_TYPES.TITLE, 'title', 'The Book'],
    [OPEN_LIBRARY_SEARCH_TYPES.AUTHOR, 'author', 'The Writer'],
  ])('searches by %s and normalizes usable results', async (type, key, query) => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ docs: [
        { key: '/works/1', title: 'The Book', author_name: ['The Writer'], cover_i: 42, first_publish_year: 2001 },
        { key: '/works/2', author_name: ['No Title'] },
      ] }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const results = await searchOpenLibraryBooks(query, type)
    const url = new URL(fetchMock.mock.calls[0][0])

    expect(url.searchParams.get(key)).toBe(query)
    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({ title: 'The Book', author: 'The Writer', publishYear: 2001 })
    expect(results[0].book.coverUrl).toContain('/42-M.jpg')
  })

  it('uses the ISBN query and safely handles a missing cover', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ docs: [{ title: 'ISBN Book', isbn: ['other', '9781234'] }] }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const results = await searchOpenLibraryBooks('978-1234', OPEN_LIBRARY_SEARCH_TYPES.ISBN)

    expect(new URL(fetchMock.mock.calls[0][0]).searchParams.get('q')).toBe('isbn:9781234')
    expect(results[0].book).toMatchObject({ isbn: '9781234', coverUrl: '' })
  })

  it('returns no results for blank input without making a request', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    expect(await searchOpenLibraryBooks('  ', OPEN_LIBRARY_SEARCH_TYPES.TITLE)).toEqual([])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects HTTP and network errors', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({ ok: false }).mockRejectedValueOnce(new Error('offline'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(searchOpenLibraryBooks('Book', OPEN_LIBRARY_SEARCH_TYPES.TITLE)).rejects.toThrow('Open Library search failed')
    await expect(searchOpenLibraryBooks('Book', OPEN_LIBRARY_SEARCH_TYPES.TITLE)).rejects.toThrow('offline')
  })
})
