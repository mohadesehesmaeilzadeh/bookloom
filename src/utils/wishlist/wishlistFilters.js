export const ALL_PRIORITIES = 'all'

export function filterWishlistByPriority(books, priority) {
  if (!priority || priority === ALL_PRIORITIES) {
    return [...books]
  }

  return books.filter((book) => book.priority === priority)
}
