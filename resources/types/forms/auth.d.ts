import { loginFormSchema } from '@/app/(auth)/login'
import registerFormSchema from '@/resources/forms/auth/register.zod'
import { z } from 'zod'

export type LoginForm = z.infer<typeof loginFormSchema>
export type RegisterFormData = z.infer<typeof registerFormSchema>
