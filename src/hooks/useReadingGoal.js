import { useCallback, useMemo, useState } from 'react'
import {
  loadReadingGoals,
  saveReadingGoals,
  setAnnualReadingGoal,
} from '../utils/readingGoalStorage'

export function useReadingGoal(year = new Date().getFullYear()) {
  const [goals, setGoals] = useState(loadReadingGoals)
  const yearKey = String(year)
  const annualGoal = goals.annualGoals[yearKey] ?? 0
  const hasAnnualGoal = Object.prototype.hasOwnProperty.call(goals.annualGoals, yearKey)

  const saveAnnualGoal = useCallback((goal) => {
    const nextGoals = setAnnualReadingGoal(goals, yearKey, goal)

    setGoals(nextGoals)
    saveReadingGoals(nextGoals)
  }, [goals, yearKey])

  return useMemo(
    () => ({
      annualGoal,
      hasAnnualGoal,
      saveAnnualGoal,
      year,
    }),
    [annualGoal, hasAnnualGoal, saveAnnualGoal, year],
  )
}
