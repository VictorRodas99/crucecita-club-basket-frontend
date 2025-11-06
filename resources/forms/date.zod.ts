import { z } from 'zod'
import { parseDate } from '../lib/utils'

export const commonDateSchema = z
  .string()
  .min(1, 'La fecha de nacimiento es requerida')
  .refine((date) => {
    const parsedDate = parseDate(date)

    if (!parsedDate) {
      return false
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (parsedDate.getFullYear() < today.getFullYear() - 125) {
      return false
    }

    return parsedDate < today
  }, 'La fecha de nacimiento debe ser válida')
