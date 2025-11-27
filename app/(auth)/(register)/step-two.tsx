import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/resources/components/card'
import { InputDate } from '@/resources/components/date-input'
import FormField from '@/resources/components/form-field'
import GradientButton from '@/resources/components/gradient-button'
import { Icon } from '@/resources/components/icon'
import ImagePicker from '@/resources/components/image-input'
import { Button } from '@/resources/components/primitives/button'
import { Label } from '@/resources/components/primitives/label'
import { Text } from '@/resources/components/primitives/text'
import { BUTTON_COLORS_GRADIENT } from '@/resources/constants/sections/register/gradient-button'
import { cn } from '@/resources/lib/utils'
import { RNFile } from '@/resources/types/file'
import { RegisterFormData } from '@/resources/types/forms/auth'
import { StepsProps } from '@/resources/types/sections/register/props'
import { ArrowRight, ChevronLeft } from 'lucide-react-native'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { View } from 'react-native'

const fields = [
  'nombre',
  'apellido',
  'email',
  'telefono',
  'fecha_nacimiento',
  'foto_perfil',
  'descripcion'
] as const

export default function StepTwo({ onNext, onPrevious }: StepsProps) {
  const form = useFormContext<RegisterFormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNext = async () => {
    setIsSubmitting(true)

    const results: Promise<boolean>[] = []

    for (const field of fields) {
      results.push(form.trigger(field))
    }

    const awaitedResults = await Promise.all(results)

    if (awaitedResults.every((result) => result)) {
      // console.log(form.getValues())
      onNext()
    }

    setIsSubmitting(false)
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
            <CardTitle className="text-xl">¡Sigamos!</CardTitle>
            <CardDescription className="text-center">
              Ahora necesitamos saber tus datos personales principales para
              registrarte.
            </CardDescription>
          </View>
        </CardHeader>
        <CardContent>
          <View className="w-full justify-center gap-4">
            <View className="gap-2 justify-center items-center">
              <Label htmlFor="fecha_nacimiento">Foto de Perfil</Label>
              <FormField
                form={form}
                name="foto_perfil"
                render={({
                  field: { onChange, value },
                  fieldState: { error }
                }) => (
                  <View className={cn('flex flex-col', { 'gap-1': error })}>
                    <ImagePicker
                      value={value as RNFile}
                      onChange={onChange}
                      className="size-20 rounded-full"
                      iconColor="white"
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
            <View className="gap-2 flex-row">
              <View className="gap-2 w-1/2">
                <Label htmlFor="nombre">Nombre</Label>
                <FormField form={form} name="nombre" placeholder="Richard" />
              </View>
              <View className="gap-2 w-1/2">
                <Label htmlFor="apellido">Apellido</Label>
                <FormField form={form} name="apellido" placeholder="Gómez" />
              </View>
            </View>
            <View className="gap-2">
              <Label htmlFor="email">Email</Label>
              <FormField
                form={form}
                name="email"
                placeholder="tu@email.com"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <View className="gap-2">
              <Label htmlFor="email">Teléfono</Label>
              <FormField
                form={form}
                name="telefono"
                placeholder="+595 981 123456"
                keyboardType="phone-pad"
              />
            </View>
            <View className="gap-2">
              <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
              <FormField
                form={form}
                name="fecha_nacimiento"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error }
                }) => (
                  <View className={cn('flex flex-col', { 'gap-1': error })}>
                    <InputDate
                      onBlur={onBlur}
                      onChangeDate={onChange}
                      value={!value ? '' : (value as string)}
                      includePicker
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
        <CardFooter className="gap-3">
          <GradientButton
            onPress={handleNext}
            disabled={isSubmitting}
            colors={BUTTON_COLORS_GRADIENT}
          >
            <Text className="text-white font-semibold text-sm">
              Continuar con el Registro
            </Text>
            <ArrowRight color="white" size={18} />
          </GradientButton>
        </CardFooter>
      </Card>
    </View>
  )
}
