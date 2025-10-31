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
  if (!day || !month || !year) return null

  const date = new Date(year, month - 1, day)
  if (isNaN(date.getTime())) return null

  return date
}
