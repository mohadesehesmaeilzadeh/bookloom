function validTimestamp(value) {
  return typeof value === 'string' && value.trim() !== '' && Number.isFinite(Date.parse(value))
}

export function normalizeReadingSessions(value) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((session) => {
    if (
      !session ||
      typeof session !== 'object' ||
      typeof session.id !== 'string' ||
      !session.id.trim() ||
      !validTimestamp(session.startedAt) ||
      !validTimestamp(session.endedAt) ||
      Date.parse(session.endedAt) < Date.parse(session.startedAt)
    ) {
      return []
    }

    const pagesRead = Number(session.pagesRead)

    return [{
      id: session.id,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      durationMs: Math.max(0, Date.parse(session.endedAt) - Date.parse(session.startedAt)),
      pagesRead: session.pagesRead !== null && session.pagesRead !== undefined &&
        Number.isInteger(pagesRead) && pagesRead >= 0 ? pagesRead : null,
    }]
  })
}

export function getActiveReadingBook(books) {
  return books.find((book) => validTimestamp(book.activeReadingSessionStartedAt)) ?? null
}

export function getReadingDurationParts(durationMs) {
  const seconds = Math.floor(Math.max(0, Number(durationMs) || 0) / 1000)

  return {
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  }
}
