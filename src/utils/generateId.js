export function generateId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  const randomPart = Math.random().toString(36).slice(2, 11)
  const timePart = Date.now().toString(36)

  return `book_${timePart}_${randomPart}`
}
