import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/resources/components/card'
import FormField from '@/resources/components/form-field'
import GradientButton from '@/resources/components/gradient-button'
import { Icon } from '@/resources/components/icon'
import PasswordInput from '@/resources/components/password-input'
import { Button } from '@/resources/components/primitives/button'
import { Label } from '@/resources/components/primitives/label'
import { Text } from '@/resources/components/primitives/text'
import { BUTTON_COLORS_GRADIENT } from '@/resources/constants/sections/register/gradient-button'
import { useRegisterMutation } from '@/resources/features/auth/use-auth-mutations'
import { handleApiErrors } from '@/resources/lib/handle-api-errors'
import { cn } from '@/resources/lib/utils'
import { RegisterFormData } from '@/resources/types/forms/auth'
import { StepsProps } from '@/resources/types/sections/register/props'
import { usePathname, useRouter } from 'expo-router'
import { ArrowRight, ChevronLeft } from 'lucide-react-native'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import { toast } from 'sonner-native'

/*
{"alumnos": [{"apellido": "Uno", "estatura_cm": "120.4", "fecha_nacimiento": "12/02/2018", "ficha_medica": [Object], "foto_cedula_dorsal": [Object], "foto_cedula_frontal": [Object], "nombre": "Hijao", "observaciones": "", "peso_kg": "40.5"}, {"apellido": "Dos", "estatura_cm": "145.6", "fecha_nacimiento": "03/04/2012", "ficha_medica": [Object], "foto_cedula_dorsal": [Object], "foto_cedula_frontal": [Object], "nombre": "Hijo", "observaciones": "Algo que agregar", "peso_kg": "40.3"}], "apellido": "Name", "device_name": "sdk_gphone64_x86_64", "email": "somename@gmail.com", "fecha_nacimiento": "20/12/2002", "foto_perfil": undefined, "nombre": "Some", "password": "something", "password_confirmation": "something", "rol": {"label": "Tutor", "value": "tutor"}, "telefono": "0981818181"}
*/

export default function StepThree({ onPrevious }: StepsProps) {
  const form = useFormContext<RegisterFormData>()
  const userRegister = useRegisterMutation()
  const router = useRouter()
  const pathname = usePathname()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = (data: RegisterFormData) => {
    setIsSubmitting(true)

    // @ts-ignore
    data.rol = data.rol.value

    userRegister.mutate(data, {
      onSuccess: (response) => {
        if (response.success) {
          toast.info('Cuenta Registrada con Éxito!', {
            description:
              'Deberá esperar la confirmación del administrador para poder iniciar sesión',
            duration: 5_000
          })
          router.navigate('/(auth)/login')
        }
      },
      onError: async (error) => {
        await handleApiErrors({
          error,
          setError: form.setError,
          forceNotifications: pathname === '/register'
        })
      },
      onSettled: () => {
        setIsSubmitting(false)
      }
    })
  }

  return (
    <View>
      <Card className="w-full max-w-sm shadow-lg">
        {onPrevious && (
          <View className="absolute top-1 left-0">
            <Button variant="link" onPress={onPrevious}>
              <Icon as={ChevronLeft} size={18} />
            </Button>
          </View>
        )}
        <CardHeader className="flex-row">
          <View className="flex-1 gap-1.5 items-center">
            <CardTitle className="text-xl">Gracias por registrarte.</CardTitle>
            <CardDescription className="text-center">
              Como último paso necesitamos una que ingreses una contraseña
              robusta para ingresar a tu cuenta.
            </CardDescription>
          </View>
        </CardHeader>
        <CardContent className="w-full justify-center gap-4">
          <View className="gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <FormField
              form={form}
              name="password"
              render={({
                field: { value, onChange, onBlur },
                fieldState: { error }
              }) => (
                <View className={cn('flex flex-col', { 'gap-1': error })}>
                  <PasswordInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value as string}
                  />

                  {error && (
                    <Text className="text-xs font-bold leading-none text-red-500 mt-1">
                      {error.message ?? 'El campo es requerido'}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
          <View className="gap-2">
            <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
            <FormField
              form={form}
              name="password_confirmation"
              render={({
                field: { value, onChange, onBlur },
                fieldState: { error }
              }) => (
                <View className={cn('flex flex-col', { 'gap-1': error })}>
                  <PasswordInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value as string}
                  />

                  {error && (
                    <Text className="text-xs font-bold leading-none text-red-500 mt-1">
                      {error.message ?? 'El campo es requerido'}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
        </CardContent>
        <CardFooter className="gap-5 flex-col">
          <GradientButton
            onPress={() => form.handleSubmit(onSubmit)()}
            disabled={isSubmitting}
            colors={BUTTON_COLORS_GRADIENT}
          >
            <Text className="text-white font-semibold text-sm">
              {isSubmitting ? 'Enviando Solicitud...' : 'Enviar Solicitud'}
            </Text>
            <ArrowRight color="white" size={18} />
          </GradientButton>
          <View className="p-2 bg-secondary rounded-md">
            <Text className="text-sm text-center text-secondary-foreground">
              <Text className="text-sm font-semibold">Nota:</Text> Su solicitud
              será revisada por un administrador.
            </Text>
          </View>
        </CardFooter>
      </Card>
    </View>
  )
}
