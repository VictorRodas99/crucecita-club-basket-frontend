// credits to Lokman Musliu
// https://www.luckymedia.dev/about/lokman-musliu

import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner-native'
import { ErrorResponse } from '../types/api-responses'

export async function handleApiErrors<T extends FieldValues>({
  error,
  setError,
  forceNotifications = false
}: {
  error: any
  setError: UseFormSetError<T>
  forceNotifications?: boolean
}): Promise<void> {
  if (error?.name === 'HTTPError' && error.response?.status === 422) {
    const response = (await error.response.json()) as ErrorResponse
    const errors = response?.errors

    if (!errors) {
      return
    }

    Object.keys(errors).forEach((field) => {
      // Join error messages on one single string
      const errorMessage = Array.isArray(errors[field])
        ? errors[field].join(' ')
        : errors[field]

      if (forceNotifications) {
        toast.error(`Error en el campo ${field}`, { description: errorMessage })
      }

      setError(field as Path<T>, {
        type: 'manual',
        message: errorMessage as string
      })
    })
  } else {
    console.error({ error })
    toast.error('Algo salió mal')
  }
}
