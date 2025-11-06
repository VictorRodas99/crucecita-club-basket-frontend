// credits to Lokman Musliu
// https://www.luckymedia.dev/about/lokman-musliu

import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { toast as primititveToast } from 'sonner-native'

export async function handleApiErrors<T extends FieldValues>({
  error,
  setError,
  toast
}: {
  error: any
  setError: UseFormSetError<T>
  toast: typeof primititveToast
}): Promise<void> {
  if (error?.name === 'HTTPError' && error.response.status === 422) {
    const errors = await (error as any).response.json()

    Object.keys(errors).forEach((field) => {
      // Join error messages on one single string
      const errorMessage = Array.isArray(errors[field])
        ? errors[field].join(' ')
        : errors[field]

      setError(field as Path<T>, {
        type: 'manual',
        message: errorMessage as string
      })
    })
  } else {
    // console.log(JSON.stringify(error, null, 2));
    toast.error('Algo salió mal')
  }
}
