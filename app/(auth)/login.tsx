import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/resources/components/card'
import { Button } from '@/resources/components/primitives/button'
import { Input } from '@/resources/components/primitives/input'
import { Label } from '@/resources/components/primitives/label'
import { cn } from '@/resources/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Device from 'expo-device'
import { router } from 'expo-router'
import { Eye, EyeClosed, LucideProps } from 'lucide-react-native'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Image, Pressable, Text, View, useColorScheme } from 'react-native'
import { z } from 'zod'

const mainLogo = require('@/resources/assets/images/main-logo.png')

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Email Inválido' }),
  password: z
    .string()
    .min(6, 'La contraseña debe ser de al menos 6 caracteres'),
  device_name: z.string()
})

type LoginForm = z.infer<typeof loginFormSchema>

const EyeIcon = ({
  type,
  ...props
}: { type: 'opened' | 'closed' } & LucideProps) => {
  if (type === 'opened') {
    return <Eye {...props} />
  }

  if (type === 'closed') {
    return <EyeClosed {...props} />
  }

  throw new Error(
    `Invalid type, expected "opened" or "closed" but "${type}" was given`
  )
}

export default function Login() {
  const colorScheme = useColorScheme()
  const [isPasswordInputSecured, setIsPasswordInputSecured] = useState(true)

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      device_name: Device.deviceName ?? 'web'
    }
  })

  const {
    formState: { errors },
    handleSubmit
  } = form

  const onSubmit = async (values: LoginForm) => {
    console.log(values)
  }

  return (
    <View className="flex-1 px-5">
      <View className="items-center py-12 gap-2">
        <View className="size-12">
          <Image source={mainLogo} className="flex-1 size-full" />
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-white">
            Club Crucecita de Basket
          </Text>
          <Text className="text-muted-foreground">
            Gestión Integral de Básquetbol
          </Text>
        </View>
      </View>
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
                render={({ field: { name, onChange, onBlur, value } }) => (
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
                render={({ field: { name, onChange, onBlur, value } }) => (
                  <View
                    className={cn('flex flex-col', { 'gap-1': errors[name] })}
                  >
                    <View className="relative">
                      <Input
                        placeholder="*****"
                        autoCapitalize="none"
                        secureTextEntry={isPasswordInputSecured}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                      <View className="absolute top-2 right-3">
                        <Pressable
                          onPress={() =>
                            setIsPasswordInputSecured((prev) => !prev)
                          }
                        >
                          <EyeIcon
                            type={isPasswordInputSecured ? 'opened' : 'closed'}
                            color={colorScheme === 'dark' ? 'white' : 'black'}
                          />
                        </Pressable>
                      </View>
                    </View>

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
          <Button className="w-full" onPress={() => handleSubmit(onSubmit)()}>
            <Text className="text-white font-semibold">Iniciar Sesión</Text>
          </Button>
          <Button
            variant="link"
            // @ts-ignore
            onPress={() => router.push('/(auth)/forgot-password')}
          >
            <Text className="text-muted-foreground">
              ¿Olvidaste tu contraseña?
            </Text>
          </Button>
        </CardFooter>
      </Card>
    </View>
  )
}
