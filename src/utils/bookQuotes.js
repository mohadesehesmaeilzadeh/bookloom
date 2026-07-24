import { getTodayDateString } from './dateUtils'

function safeTimestamp(value) {
  const parsed = Date.parse(value)

  return Number.isNaN(parsed) ? 0 : parsed
}

function validQuotesForBook(book) {
  return Array.isArray(book?.quotes)
    ? book.quotes.filter((quote) => quote && typeof quote.text === 'string' && quote.text.trim())
    : []
}

export function sortQuotesByCreatedAt(quotes) {
  return [...quotes].sort((a, b) => {
    const dateDifference = safeTimestamp(b.createdAt) - safeTimestamp(a.createdAt)

    if (dateDifference !== 0) {
      return dateDifference
    }

    return String(a.text ?? '').localeCompare(String(b.text ?? ''), 'fa')
  })
}

export function getAllBookQuotes(books) {
  if (!Array.isArray(books)) {
    return []
  }

  return books.flatMap((book) =>
    validQuotesForBook(book).map((quote) => ({
      author: book.author,
      bookId: book.id,
      bookTitle: book.title,
      quote,
    })),
  )
}

function dateSeed(value) {
  return [...value].reduce((total, character) => total + character.charCodeAt(0), 0)
}

export function getDailyBookQuote(books, dateString = getTodayDateString()) {
  const quotes = getAllBookQuotes(books)

  if (quotes.length === 0) {
    return null
  }

  return quotes[dateSeed(dateString) % quotes.length]
}
