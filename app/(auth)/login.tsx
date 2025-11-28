import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/resources/components/card'
import PasswordInput from '@/resources/components/password-input'
import { Button } from '@/resources/components/primitives/button'
import { Input } from '@/resources/components/primitives/input'
import { Label } from '@/resources/components/primitives/label'
import { zodSpanishRulesMessages } from '@/resources/constants/rules'
import { useLoginMutation } from '@/resources/features/auth/use-auth-mutations'
import { useSession } from '@/resources/hooks/session'
import { handleApiErrors } from '@/resources/lib/handle-api-errors'
import { cn } from '@/resources/lib/utils'
import { LoginForm } from '@/resources/types/forms/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Device from 'expo-device'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, Text, View } from 'react-native'
import { toast } from 'sonner-native'
import { z } from 'zod'

export const loginFormSchema = z.object({
  email: z.string().email({ message: 'Email Inválido' }),
  password: z.string().min(6, zodSpanishRulesMessages.passwordMin),
  device_name: z.string()
})

export default function Login() {
  const userLogin = useLoginMutation()
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      device_name: Device.deviceName ?? 'web'
    }
  })

  const { setSession } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { handleSubmit } = form

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true)

    userLogin.mutate(data, {
      onSuccess: (response) => {
        if (response.success) {
          setSession({
            accessToken: response.access_token,
            user: response.data
          })
        }
      },
      onError: async (error) => {
        await handleApiErrors({ error, setError: form.setError })
      },
      onSettled: () => {
        setIsSubmitting(false)
      }
    })
  }

  return (
    <>
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="flex-row">
          <View className="flex-1 gap-1.5 items-center">
            <CardTitle className="text-xl">Bienvenido</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder
            </CardDescription>
          </View>
        </CardHeader>
        <CardContent>
          <View className="w-full justify-center gap-4">
            <View className="gap-2">
              <Label htmlFor="email">Email</Label>
              <Controller
                name="email"
                control={form.control}
                render={({
                  field: { name, onChange, onBlur, value },
                  formState: { errors }
                }) => (
                  <View
                    className={cn('flex flex-col', { 'gap-1': errors[name] })}
                  >
                    <Input
                      autoCapitalize="none"
                      placeholder="tu@email.com"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      value={value}
                    />
                    {errors[name] && (
                      <Text className="text-xs font-bold leading-none text-red-500 mt-1">
                        {errors[name].message ?? 'El campo es requerido'}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
            <View className="gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Controller
                name="password"
                control={form.control}
                render={({
                  field: { name, onChange, onBlur, value },
                  formState: { errors }
                }) => (
                  <View
                    className={cn('flex flex-col', { 'gap-1': errors[name] })}
                  >
                    <PasswordInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />

                    {errors[name] && (
                      <Text className="text-xs font-bold leading-none text-red-500 mt-1">
                        {errors[name].message ?? 'El campo es requerido'}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Pressable
            onPress={() => handleSubmit(onSubmit)()}
            className="w-full opacity-100"
            disabled={isSubmitting}
          >
            <LinearGradient
              colors={['#10c8e0', '#0891b2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: '100%',
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text className="text-white font-semibold">
                {isSubmitting ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
              </Text>
            </LinearGradient>
          </Pressable>
          <Button
            variant="link"
            // onPress={() => router.push('/forgot-password')}
            onPress={() => toast.warning('Apartado aún en desarrollo')}
          >
            <Text className="text-muted-foreground text-xs">
              ¿Olvidaste tu contraseña?
            </Text>
          </Button>

          <View className="w-full flex-row items-center">
            <View className="w-[40%] border-t border-muted-foreground"></View>
            <Text className="w-[20%] text-black dark:text-white text-center text-xs">
              O
            </Text>
            <View className="w-[40%] border-t border-muted-foreground"></View>
          </View>

          <View>
            <Button
              variant="link"
              // @ts-ignore
              onPress={() => router.push('/register')}
            >
              <Text className="text-muted-foreground text-xs">
                ¿No tiene una cuenta?{' '}
                <Text className="font-bold text-primary underline">
                  Regístrate
                </Text>
              </Text>
            </Button>
          </View>
        </CardFooter>
      </Card>
    </>
  )
}
