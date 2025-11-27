type SuccessResponse<T = Record<string, any>> = {
  success: true
  message: string
  data: T
  error?: never
  errors?: never
}

type ErrorResponse = {
  success: false
  message: string
  data?: never
  error?: string
  errors?: Record<string, string[]>
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse

export type AuthApiResponse<T = []> =
  | (SuccessResponse<T> & { access_token: string })
  | (ErrorResponse & { access_token?: never })
