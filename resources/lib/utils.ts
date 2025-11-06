import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalize(string: string) {
  if (typeof string !== 'string') {
    throw new Error('Expected a string')
  }

  return string[0].toUpperCase() + string.substring(1)
}

/**
 * @param dateString DD/MM/YYYY
 */
export const parseDate = (dateString: string): Date | null => {
  if (!dateString || dateString.length !== 10) return null

  const [day, month, year] = dateString.split('/').map(Number)

  if (!day || !month || !year) {
    return null
  }

  if (month > 12) {
    return null
  }

  const date = new Date(year, month - 1, day)
  if (isNaN(date.getTime())) return null

  return date
}

export const getYearsSince = (date: Date) => {
  if (!(date instanceof Date)) {
    throw new Error('Invalid date')
  }

  const today = new Date()

  today.setHours(0, 0, 0)
  date.setHours(0, 0, 0)

  let years = today.getFullYear() - date.getFullYear()

  if (today.getMonth() < date.getMonth()) {
    years--
  }

  return years
}
