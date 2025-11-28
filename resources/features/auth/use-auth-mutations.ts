import { User } from '@/resources/context/session.context'
import { toFormData } from '@/resources/lib/formatters'
import http from '@/resources/lib/http'
import { AuthApiResponse } from '@/resources/types/api-responses'
import { LoginForm, RegisterFormData } from '@/resources/types/forms/auth'
import { useMutation } from '@tanstack/react-query'

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (data: LoginForm) =>
      http
        .post('login', { body: await toFormData(data) })
        .json<AuthApiResponse<User>>()
  })
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (data: RegisterFormData) =>
      http
        .post('register', { body: await toFormData(data) })
        .json<AuthApiResponse<User>>()
  })
}

export async function logout({ token }: { token?: string }) {
  await http
    .post('logout', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .json()
}
