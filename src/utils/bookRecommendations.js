import { BOOK_PRIORITY, bookPriorityByValue } from '../constants/bookPriorities'
import { RECOMMENDATION_MODE } from '../constants/recommendationModes'
import { BOOK_STATUS } from '../constants/bookStatuses'
import { formatNumber } from './formatNumber'
import { normalizeSearchText } from './bookSearch'

const eligibleStatuses = new Set([BOOK_STATUS.OWNED, BOOK_STATUS.PAUSED])

const priorityScores = {
  [BOOK_PRIORITY.URGENT]: 40,
  [BOOK_PRIORITY.HIGH]: 30,
  [BOOK_PRIORITY.MEDIUM]: 20,
  [BOOK_PRIORITY.LOW]: 10,
}

function safeArray(books) {
  return Array.isArray(books) ? books : []
}

function safeNumber(value) {
  const number = Number(value)

  return Number.isFinite(number) ? number : 0
}

function safePageCount(value) {
  return Math.max(0, Math.floor(safeNumber(value)))
}

function normalizeCategory(value) {
  return normalizeSearchText(typeof value === 'string' ? value.trim() : '')
}

function parseDateOnly(value) {
  if (typeof value !== 'string') {
    return null
  }

  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!match) {
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

function timestamp(value) {
  const dateOnly = parseDateOnly(value)

  if (dateOnly) {
    return dateOnly.getTime()
  }

  const parsed = Date.parse(value)

  return Number.isNaN(parsed) ? 0 : parsed
}

function titleCompare(a, b) {
  return String(a.title ?? '').localeCompare(String(b.title ?? ''), 'fa')
}

function priorityRank(book) {
  return bookPriorityByValue[book.priority]?.rank ?? bookPriorityByValue[BOOK_PRIORITY.MEDIUM].rank
}

function comparePriority(a, b) {
  return priorityRank(a) - priorityRank(b)
}

function compareOldestPurchase(a, b) {
  const aPurchase = timestamp(a.purchaseDate)
  const bPurchase = timestamp(b.purchaseDate)

  if (aPurchase > 0 && bPurchase > 0 && aPurchase !== bPurchase) {
    return aPurchase - bPurchase
  }

  if (aPurchase > 0 && bPurchase === 0) {
    return -1
  }

  if (aPurchase === 0 && bPurchase > 0) {
    return 1
  }

  const createdDifference = timestamp(a.createdAt) - timestamp(b.createdAt)

  if (createdDifference !== 0) {
    return createdDifference
  }

  return titleCompare(a, b)
}

function compareRecommendationTie(a, b) {
  const priorityDifference = comparePriority(a, b)

  if (priorityDifference !== 0) {
    return priorityDifference
  }

  const purchaseDifference = compareOldestPurchase(a, b)

  if (purchaseDifference !== 0) {
    return purchaseDifference
  }

  return titleCompare(a, b)
}

function hasKnownPages(book) {
  return safePageCount(book.totalPages) > 0
}

function categoryMatches(book, category) {
  const normalizedCategory = normalizeCategory(category)

  return Boolean(normalizedCategory) && normalizeCategory(book.category) === normalizedCategory
}

export function getEligibleRecommendationBooks(books) {
  return safeArray(books).filter(
    (book) =>
      book &&
      typeof book.id === 'string' &&
      book.id.trim() &&
      typeof book.title === 'string' &&
      book.title.trim() &&
      eligibleStatuses.has(book.status),
  )
}

export function isBookRecommendationEligible(book) {
  return getEligibleRecommendationBooks([book]).length === 1
}

export function getRecommendationCategories(books) {
  const categories = new Map()

  for (const book of getEligibleRecommendationBooks(books)) {
    if (typeof book.category !== 'string') {
      continue
    }

    const displayValue = book.category.trim()
    const normalizedValue = normalizeCategory(displayValue)

    if (normalizedValue && !categories.has(normalizedValue)) {
      categories.set(normalizedValue, displayValue)
    }
  }

  return [...categories.values()].sort((a, b) => a.localeCompare(b, 'fa'))
}

export function getRandomRecommendation(eligibleBooks, previousBookId) {
  const books = getEligibleRecommendationBooks(eligibleBooks)

  if (books.length === 0) {
    return null
  }

  const pool =
    previousBookId && books.length > 1
      ? books.filter((book) => book.id !== previousBookId)
      : books
  const book = pool[Math.floor(Math.random() * pool.length)]

  return {
    book,
    mode: RECOMMENDATION_MODE.RANDOM,
    reasons: ['این گزینه به‌صورت محلی از میان کتاب‌های قابل پیشنهاد انتخاب شد.'],
  }
}

export function getHighestPriorityRecommendation(eligibleBooks) {
  const book = getEligibleRecommendationBooks(eligibleBooks).sort((a, b) => {
    const priorityDifference = comparePriority(a, b)

    if (priorityDifference !== 0) {
      return priorityDifference
    }

    return compareOldestPurchase(a, b)
  })[0]

  return book
    ? {
        book,
        mode: RECOMMENDATION_MODE.HIGHEST_PRIORITY,
        reasons: ['اولویت این کتاب نسبت به گزینه‌های دیگر بالاتر است.'],
      }
    : null
}

export function getOldestPurchaseRecommendation(eligibleBooks) {
  const book = getEligibleRecommendationBooks(eligibleBooks).sort((a, b) => {
    const purchaseDifference = compareOldestPurchase(a, b)

    if (purchaseDifference !== 0) {
      return purchaseDifference
    }

    return comparePriority(a, b)
  })[0]

  if (!book) {
    return null
  }

  const reasons = [book.purchaseDate
    ? 'این کتاب از مدت بیشتری نسبت به بقیه در کتابخانه باقی مانده است.'
    : 'تاریخ خرید معتبری پیدا نشد؛ قدیمی‌ترین تاریخ ثبت کتاب ملاک قرار گرفت.']

  return {
    book,
    mode: RECOMMENDATION_MODE.OLDEST_PURCHASE,
    reasons,
  }
}

export function getShortestBookRecommendation(eligibleBooks) {
  const booksWithPages = getEligibleRecommendationBooks(eligibleBooks).filter(hasKnownPages)

  if (booksWithPages.length === 0) {
    return {
      book: null,
      mode: RECOMMENDATION_MODE.SHORTEST_BOOK,
      message: 'هیچ کتاب قابل پیشنهادی با تعداد صفحه مشخص وجود ندارد.',
      reasons: [],
    }
  }

  const book = booksWithPages.sort((a, b) => {
    const pageDifference = safePageCount(a.totalPages) - safePageCount(b.totalPages)

    if (pageDifference !== 0) {
      return pageDifference
    }

    return compareRecommendationTie(a, b)
  })[0]

  return {
    book,
    mode: RECOMMENDATION_MODE.SHORTEST_BOOK,
    reasons: ['تعداد صفحات این کتاب نسبت به گزینه‌های قابل پیشنهاد کمتر است.'],
  }
}

export function getCategoryRecommendation(eligibleBooks, category) {
  const normalizedCategory = normalizeCategory(category)

  if (!normalizedCategory) {
    return {
      book: null,
      mode: RECOMMENDATION_MODE.SELECTED_CATEGORY,
      message: 'برای این روش باید یک دسته‌بندی انتخاب شود.',
      reasons: [],
    }
  }

  const matches = getEligibleRecommendationBooks(eligibleBooks).filter((book) =>
    categoryMatches(book, category),
  )

  if (matches.length === 0) {
    return {
      book: null,
      mode: RECOMMENDATION_MODE.SELECTED_CATEGORY,
      message: 'در دسته‌بندی انتخاب‌شده کتاب قابل پیشنهادی پیدا نشد.',
      reasons: [],
    }
  }

  const book = matches.sort((a, b) => {
    const priorityDifference = comparePriority(a, b)

    if (priorityDifference !== 0) {
      return priorityDifference
    }

    const purchaseDifference = compareOldestPurchase(a, b)

    if (purchaseDifference !== 0) {
      return purchaseDifference
    }

    if (hasKnownPages(a) && hasKnownPages(b) && a.totalPages !== b.totalPages) {
      return safePageCount(a.totalPages) - safePageCount(b.totalPages)
    }

    return titleCompare(a, b)
  })[0]

  return {
    book,
    mode: RECOMMENDATION_MODE.SELECTED_CATEGORY,
    reasons: ['این کتاب با دسته‌بندی انتخاب‌شده هماهنگ است.'],
  }
}

export function getDaysSinceDate(dateString, today = new Date()) {
  const date = parseDateOnly(dateString)

  if (!date) {
    return 0
  }

  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const difference = todayDate.getTime() - date.getTime()

  return Math.max(0, Math.floor(difference / 86_400_000))
}

function bookLengthScore(book) {
  const pages = safePageCount(book.totalPages)

  if (pages <= 0) {
    return 0
  }

  if (pages <= 150) {
    return 15
  }

  if (pages <= 300) {
    return 10
  }

  if (pages <= 500) {
    return 5
  }

  return 2
}

export function scoreRecommendationBook(book, options = {}) {
  const daysSincePurchase = getDaysSinceDate(book.purchaseDate, options.today)
  const scoreBreakdown = {
    priority: priorityScores[book.priority] ?? priorityScores[BOOK_PRIORITY.MEDIUM],
    purchaseAge: Math.min(30, Math.floor(daysSincePurchase / 30)),
    bookLength: bookLengthScore(book),
    preferredCategory: options.selectedCategory && categoryMatches(book, options.selectedCategory) ? 20 : 0,
    pausedStatus: book.status === BOOK_STATUS.PAUSED ? 5 : 0,
  }
  const totalScore = Object.values(scoreBreakdown).reduce((total, score) => total + score, 0)
  const reasons = []

  if (scoreBreakdown.priority >= 30) {
    reasons.push('اولویت این کتاب بالا است.')
  }

  if (scoreBreakdown.purchaseAge > 0) {
    reasons.push('این کتاب مدتی در کتابخانه مانده است.')
  }

  if (scoreBreakdown.bookLength > 0 && safePageCount(book.totalPages) <= 300) {
    reasons.push('تعداد صفحات آن نسبتاً کم است.')
  }

  if (scoreBreakdown.preferredCategory > 0) {
    reasons.push('با دسته‌بندی موردعلاقه انتخاب‌شده هماهنگ است.')
  }

  if (scoreBreakdown.pausedStatus > 0) {
    reasons.push('این کتاب قبلاً شروع شده و در حالت توقف قرار دارد.')
  }

  if (reasons.length === 0) {
    reasons.push('این کتاب با روش امتیازدهی ساده Bookloom مناسب‌ترین گزینه شد.')
  }

  return {
    book,
    reasons,
    scoreBreakdown,
    totalScore,
  }
}

export function getWeightedRecommendations(eligibleBooks, options = {}) {
  return getEligibleRecommendationBooks(eligibleBooks)
    .map((book) => scoreRecommendationBook(book, options))
    .sort((a, b) => {
      const scoreDifference = b.totalScore - a.totalScore

      if (scoreDifference !== 0) {
        return scoreDifference
      }

      return compareRecommendationTie(a.book, b.book)
    })
    .map((result) => ({
      ...result,
      mode: RECOMMENDATION_MODE.WEIGHTED,
    }))
}

export function getWeightedRecommendation(eligibleBooks, options = {}) {
  return getWeightedRecommendations(eligibleBooks, options)[0] ?? null
}

export function getRecommendationForMode(eligibleBooks, options = {}) {
  const mode = options.mode ?? RECOMMENDATION_MODE.WEIGHTED

  if (mode === RECOMMENDATION_MODE.RANDOM) {
    return getRandomRecommendation(eligibleBooks, options.previousBookId)
  }

  if (mode === RECOMMENDATION_MODE.HIGHEST_PRIORITY) {
    return getHighestPriorityRecommendation(eligibleBooks)
  }

  if (mode === RECOMMENDATION_MODE.OLDEST_PURCHASE) {
    return getOldestPurchaseRecommendation(eligibleBooks)
  }

  if (mode === RECOMMENDATION_MODE.SHORTEST_BOOK) {
    return getShortestBookRecommendation(eligibleBooks)
  }

  if (mode === RECOMMENDATION_MODE.SELECTED_CATEGORY) {
    return getCategoryRecommendation(eligibleBooks, options.selectedCategory)
  }

  return getWeightedRecommendation(eligibleBooks, options)
}

export function createScoreBreakdownRows(scoreBreakdown = {}) {
  return [
    ['اولویت', scoreBreakdown.priority],
    ['مدت حضور در کتابخانه', scoreBreakdown.purchaseAge],
    ['تعداد صفحات', scoreBreakdown.bookLength],
    ['دسته‌بندی انتخابی', scoreBreakdown.preferredCategory],
    ['کتاب متوقف‌شده', scoreBreakdown.pausedStatus],
  ].filter(([, value]) => value > 0)
}

export function formatRecommendationScore(score) {
  return formatNumber(score)
}
