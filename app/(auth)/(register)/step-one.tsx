import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/resources/components/card'
import GradientButton from '@/resources/components/gradient-button'
import { Button } from '@/resources/components/primitives/button'
import { Label } from '@/resources/components/primitives/label'
import { Text } from '@/resources/components/primitives/text'
import { Select } from '@/resources/components/select'
import { USER_ROLE } from '@/resources/constants/config'
import { capitalize, cn } from '@/resources/lib/utils'
import { Option } from '@rn-primitives/select'
import { router } from 'expo-router'
import { ArrowRight } from 'lucide-react-native'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import {
  BUTTON_COLORS_GRADIENT,
  RegisterFormData,
  StepsProps
} from './register'

const rols = Object.values(USER_ROLE).map((value) => ({
  label: capitalize(value),
  value
}))

export default function StepOne({ onNext }: StepsProps) {
  const form = useFormContext<RegisterFormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNext = async () => {
    setIsSubmitting(true)
    const isValid = await form.trigger('rol')

    if (isValid) {
      onNext()
    }

    setIsSubmitting(false)
  }

  return (
    <View>
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="flex-row">
          <View className="flex-1 gap-1.5 items-center">
            <CardTitle className="text-xl">Bienvenido!</CardTitle>
            <CardDescription className="text-center">
              Para empezar, necesitamos saber con qué tipo de usuario le
              gustaría registrarse.
            </CardDescription>
          </View>
        </CardHeader>
        <CardContent>
          <View className="w-full justify-center gap-4">
            <View className="gap-2">
              <Label htmlFor="role">Rol</Label>
              <Controller
                name="rol"
                control={form.control}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error }
                }) => (
                  <View className={cn('flex flex-col', { 'gap-1': error })}>
                    <Select
                      label="Rol de Usuario"
                      className="w-full"
                      placeholder="Seleccione un Rol"
                      options={rols}
                      onBlur={onBlur}
                      onValueChange={onChange}
                      value={value as unknown as Option}
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
          </View>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <GradientButton
            onPress={handleNext}
            disabled={isSubmitting}
            colors={BUTTON_COLORS_GRADIENT}
          >
            <Text className="text-white font-semibold">
              Empezar con el Registro
            </Text>
            <ArrowRight color="white" size={18} />
          </GradientButton>
          <View className="w-full flex-row items-center">
            <View className="w-[40%] border-t border-muted-foreground"></View>
            <Text className="w-[20%] text-black dark:text-white text-center text-xs">
              O
            </Text>
            <View className="w-[40%] border-t border-muted-foreground"></View>
          </View>

          <View>
            <Button variant="link" onPress={() => router.push('/login')}>
              <Text className="text-muted-foreground text-xs">
                ¿Ya tiene una cuenta?{' '}
                <Text className="font-bold text-primary underline text-xs">
                  Ir al Login
                </Text>
              </Text>
            </Button>
          </View>
        </CardFooter>
      </Card>
    </View>
  )
}
