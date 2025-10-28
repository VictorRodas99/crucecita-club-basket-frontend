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
