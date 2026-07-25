import { STORAGE_KEYS } from '../constants/storageKeys'

export const READING_GOALS_STORAGE_KEY = STORAGE_KEYS.readingGoals

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function normalizeGoal(value) {
  const number = Number(value)

  return Number.isInteger(number) && number >= 0 ? number : null
}

export function normalizeReadingGoals(value) {
  const source = isRecord(value) ? value : {}
  const annualGoals = isRecord(source.annualGoals) ? source.annualGoals : {}
  const normalizedGoals = {}

  for (const [year, goal] of Object.entries(annualGoals)) {
    const normalizedGoal = normalizeGoal(goal)

    if (/^\d{4}$/.test(year) && normalizedGoal !== null) {
      normalizedGoals[year] = normalizedGoal
    }
  }

  return { annualGoals: normalizedGoals }
}

export function loadReadingGoals() {
  if (!canUseLocalStorage()) {
    return { annualGoals: {} }
  }

  try {
    const rawGoals = window.localStorage.getItem(READING_GOALS_STORAGE_KEY)

    if (!rawGoals) {
      return { annualGoals: {} }
    }

    return normalizeReadingGoals(JSON.parse(rawGoals))
  } catch {
    return { annualGoals: {} }
  }
}

export function saveReadingGoals(goals) {
  if (!canUseLocalStorage()) {
    return false
  }

  try {
    window.localStorage.setItem(
      READING_GOALS_STORAGE_KEY,
      JSON.stringify(normalizeReadingGoals(goals)),
    )
    return true
  } catch {
    return false
  }
}

export function clearReadingGoals() {
  if (!canUseLocalStorage()) {
    return false
  }

  try {
    window.localStorage.removeItem(READING_GOALS_STORAGE_KEY)
    return true
  } catch {
    return false
  }
}

export function setAnnualReadingGoal(goals, year, goal) {
  const yearKey = String(year)
  const normalizedGoal = normalizeGoal(goal)

  if (!/^\d{4}$/.test(yearKey) || normalizedGoal === null) {
    return normalizeReadingGoals(goals)
  }

  return normalizeReadingGoals({
    ...goals,
    annualGoals: {
      ...normalizeReadingGoals(goals).annualGoals,
      [yearKey]: normalizedGoal,
    },
  })
}
