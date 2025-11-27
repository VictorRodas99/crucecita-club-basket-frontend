import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/resources/components/card'
import { InputDate } from '@/resources/components/date-input'
import FileInput from '@/resources/components/file-input'
import GradientButton from '@/resources/components/gradient-button'
import { Icon } from '@/resources/components/icon'
import ImagePicker from '@/resources/components/image-input'
import { Button } from '@/resources/components/primitives/button'
import {
  DEFAULT_INPUT_STYLES,
  Input
} from '@/resources/components/primitives/input'
import { Label } from '@/resources/components/primitives/label'
import { Text } from '@/resources/components/primitives/text'
import { USER_ROLE } from '@/resources/constants/config'
import { BUTTON_COLORS_GRADIENT } from '@/resources/constants/sections/register/gradient-button'
import { studentsSchema } from '@/resources/forms/auth/register.zod'
import { cn, getYearsSince, parseDate } from '@/resources/lib/utils'
import { RegisterFormData } from '@/resources/types/forms/auth'
import { StepsProps } from '@/resources/types/sections/register/props'
import {
  ArrowRight,
  ChevronLeft,
  ImageIcon,
  PlusIcon,
  Upload,
  X
} from 'lucide-react-native'
import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import { toast } from 'sonner-native'
import { z } from 'zod'

type ZodStudentSchema = z.infer<typeof studentsSchema>

type Student = Omit<
  ZodStudentSchema,
  'ficha_medica' | 'foto_cedula_frontal' | 'foto_cedula_dorsal'
> & {
  ficha_medica?: ZodStudentSchema['ficha_medica']
  foto_cedula_frontal?: ZodStudentSchema['foto_cedula_frontal']
  foto_cedula_dorsal?: ZodStudentSchema['foto_cedula_dorsal']
}

const initializeNewStudent = () => {
  return {
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    ficha_medica: undefined,
    foto_cedula_frontal: undefined,
    foto_cedula_dorsal: undefined,
    peso_kg: '',
    estatura_cm: '',
    observaciones: ''
  } as Student
}

const getFormErrors = (object: Student) => {
  const results = studentsSchema.safeParse(object)
  const errors: Record<string, string> = {}

  if (!results.success) {
    const { error: validationError } = results

    for (const error of validationError.errors) {
      const field = error.path.join('.')
      const message = error.message

      errors[field] = message
    }
  }

  return errors
}

export default function StudentsRegistrationStep({
  onPrevious,
  onNext
}: StepsProps) {
  const form = useFormContext<RegisterFormData>()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})

  const [currentStudent, setCurrentStudent] = useState<Student>(
    initializeNewStudent()
  )

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'alumnos'
  })

  const validate = ({ field, value }: { field: keyof Student; value: any }) => {
    const validKeys = Object.keys(currentStudent)

    if (!validKeys.includes(field)) {
      throw new Error(`Invalid key, given ${field}`)
    }

    // @ts-ignore
    const partialSchema = studentsSchema.pick({ [field]: true })
    const results = partialSchema.safeParse({ [field]: value })

    if (results.success) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined
      }))

      return
    }

    const error = results.error?.errors.find(
      ({ path }) => path.join('.') === field
    )?.message

    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const addStudent = () => {
    const errors = getFormErrors(currentStudent)
    setErrors(errors)

    if (Object.values(errors).length > 0) {
      return
    }

    // @ts-ignore
    append(currentStudent)
    setCurrentStudent(initializeNewStudent())
  }

  const handleNext = async () => {
    setIsSubmitting(true)

    const role = form.getValues('rol.value')
    const students = form.getValues('alumnos')

    if (role === USER_ROLE.tutor && (!students || students.length === 0)) {
      toast.error('Los tutores deben registrar al menos un alumno', {
        position: 'bottom-center'
      })
      setIsSubmitting(false)

      return
    }

    onNext()
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
            <CardTitle className="text-xl">Hijos a Inscribir</CardTitle>
            <CardDescription className="text-center">
              Ya que eligió ser un padre, necesitamos los datos principales de
              cada hijo a inscribir.
            </CardDescription>
          </View>
        </CardHeader>
        <CardContent>
          <View className="gap-6">
            <View className="gap-2">
              {fields.map((item, index) => (
                <View
                  key={item.id}
                  className="flex-row justify-between items-center border border-gray-200 dark:border-gray-400 rounded-md px-3 py-1"
                >
                  <View>
                    <Text className="text-sm font-semibold">
                      {item.nombre} {item.apellido}
                    </Text>
                    <Text className="text-sm">
                      {getYearsSince(parseDate(item.fecha_nacimiento) as Date)}{' '}
                      años
                    </Text>
                  </View>
                  <Button variant="ghost" onPress={() => remove(index)}>
                    <Text>
                      <Icon as={X} size={14} />
                    </Text>
                  </Button>
                </View>
              ))}
            </View>

            <View className="gap-4">
              <View className="gap-2 flex-row">
                <View className="gap-2 w-1/2">
                  <Label>Nombre</Label>
                  <View
                    className={cn('flex flex-col', { 'gap-1': errors.nombre })}
                  >
                    <Input
                      value={currentStudent.nombre}
                      onChangeText={(text) => {
                        validate({ field: 'nombre', value: text })
                        setCurrentStudent((prev) => ({ ...prev, nombre: text }))
                      }}
                      placeholder="Richard"
                    />
                    {errors.nombre && (
                      <Text className="text-xs font-bold leading-none text-red-500 mt-1">
                        {errors.nombre === 'Required'
                          ? 'El campo es requerido'
                          : errors.nombre}
                      </Text>
                    )}
                  </View>
                </View>
                <View className="gap-2 w-1/2">
                  <Label>Apellido</Label>
                  <View
                    className={cn('flex flex-col', {
                      'gap-1': errors.apellido
                    })}
                  >
                    <Input
                      value={currentStudent.apellido}
                      onChangeText={(text) => {
                        validate({ field: 'apellido', value: text })
                        setCurrentStudent((prev) => ({
                          ...prev,
                          apellido: text
                        }))
                      }}
                      placeholder="Gómez"
                    />
                    {errors.apellido && (
                      <Text className="text-xs font-bold leading-none text-red-500 mt-1">
                        {errors.apellido === 'Required'
                          ? 'El campo es requerido'
                          : errors.apellido}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              <View className="gap-2">
                <Label>Fecha de Nacimiento</Label>
                <View
                  className={cn('flex flex-col', {
                    'gap-1': errors.fecha_nacimiento
                  })}
                >
                  <InputDate
                    onChangeDate={(date) => {
                      validate({
                        field: 'fecha_nacimiento',
                        value: date
                      })

                      setCurrentStudent((prev) => ({
                        ...prev,
                        fecha_nacimiento: date
                      }))
                    }}
                    value={currentStudent.fecha_nacimiento}
                    includePicker
                  />
                  {errors.fecha_nacimiento && (
                    <Text className="text-xs font-bold leading-none text-red-500 mt-1">
                      {errors.fecha_nacimiento === 'Required'
                        ? 'El campo es requerido'
                        : errors.fecha_nacimiento}
                    </Text>
                  )}
                </View>
              </View>
              <View className="gap-2">
                <Label>Documentos Requeridos</Label>
                <View
                  className={cn('flex flex-col', {
                    'gap-1': errors.ficha_medica
                  })}
                >
                  <FileInput
                    value={currentStudent.ficha_medica}
                    onChange={(document) => {
                      validate({
                        field: 'ficha_medica',
                        value: document
                      })

                      setCurrentStudent((prev) => ({
                        ...prev,
                        ficha_medica: document ?? undefined
                      }))
                    }}
                    className={cn(DEFAULT_INPUT_STYLES, 'relative gap-2')}
                    errorMessage={errors.ficha_medica}
                    render={(document) => (
                      <>
                        <Icon as={Upload} size={18} />
                        <Text className="text-sm">
                          {!document || !document.uri
                            ? 'Subir Ficha Médica'
                            : document.name}
                        </Text>
                      </>
                    )}
                  />
                </View>
                <View
                  className={cn('flex flex-col', {
                    'gap-1': errors.foto_cedula_frontal
                  })}
                >
                  <ImagePicker
                    value={currentStudent.foto_cedula_frontal}
                    onChange={(image) => {
                      validate({
                        field: 'foto_cedula_frontal',
                        value: image
                      })

                      setCurrentStudent((prev) => ({
                        ...prev,
                        foto_cedula_frontal: image ?? undefined
                      }))
                    }}
                    className={cn(DEFAULT_INPUT_STYLES, 'bg-transparent')}
                    allowsEditing={false}
                    render={(image) => (
                      <View className="gap-2 flex-row items-center">
                        <Icon as={ImageIcon} size={18} />
                        <Text className="text-sm">
                          {!image?.uri
                            ? 'Subir Foto de Cédula (Frontal)'
                            : (image?.name ?? `image.${image?.mimeType}`)}
                        </Text>
                      </View>
                    )}
                  />
                  {errors.foto_cedula_frontal && (
                    <Text className="text-xs font-bold leading-none text-red-500 mt-1">
                      {errors.foto_cedula_frontal === 'Required'
                        ? 'El campo es requerido'
                        : errors.foto_cedula_frontal}
                    </Text>
                  )}
                </View>
                <View
                  className={cn('flex flex-col', {
                    'gap-1': errors.foto_cedula_dorsal
                  })}
                >
                  <ImagePicker
                    value={currentStudent.foto_cedula_dorsal}
                    onChange={(image) => {
                      validate({
                        field: 'foto_cedula_dorsal',
                        value: image
                      })

                      setCurrentStudent((prev) => ({
                        ...prev,
                        foto_cedula_dorsal: image ?? undefined
                      }))
                    }}
                    className={cn(DEFAULT_INPUT_STYLES, 'bg-transparent')}
                    allowsEditing={false}
                    render={(image) => (
                      <View className="gap-2 flex-row items-center">
                        <Icon as={ImageIcon} size={18} />
                        <Text className="text-sm">
                          {!image?.uri
                            ? 'Subir Foto de Cédula (Dorsal)'
                            : (image?.name ?? `image.${image?.mimeType}`)}
                        </Text>
                      </View>
                    )}
                  />
                  {errors.foto_cedula_dorsal && (
                    <Text className="text-xs font-bold leading-none text-red-500 mt-1">
                      {errors.foto_cedula_dorsal === 'Required'
                        ? 'El campo es requerido'
                        : errors.foto_cedula_dorsal}
                    </Text>
                  )}
                </View>
              </View>
              <View className="gap-2">
                <Label>Datos Físicos Principales</Label>
                <View
                  className={cn('flex flex-col', {
                    'gap-1': errors.peso_kg
                  })}
                >
                  <Input
                    value={String(currentStudent.peso_kg || '')}
                    onChangeText={(text) => {
                      validate({ field: 'peso_kg', value: text })

                      // @ts-ignore it receives text as string and cannot be transformed to number
                      setCurrentStudent((prev) => ({
                        ...prev,
                        peso_kg: text
                      }))
                    }}
                    placeholder="Peso (en kg)"
                    inputMode="decimal"
                  />
                  {errors.peso_kg && (
                    <Text className="text-xs font-bold leading-none text-red-500 mt-1">
                      {errors.peso_kg === 'Required'
                        ? 'El campo es requerido'
                        : errors.peso_kg}
                    </Text>
                  )}
                </View>

                <View
                  className={cn('flex flex-col', {
                    'gap-1': errors.estatura_cm
                  })}
                >
                  <Input
                    value={String(currentStudent.estatura_cm || '')}
                    onChangeText={(text) => {
                      validate({ field: 'estatura_cm', value: text })

                      // @ts-ignore it receives text as string and cannot be transformed to number
                      setCurrentStudent((prev) => ({
                        ...prev,
                        estatura_cm: text
                      }))
                    }}
                    placeholder="Estura (en cm)"
                    inputMode="decimal"
                  />
                  {errors.estatura_cm && (
                    <Text className="text-xs font-bold leading-none text-red-500 mt-1">
                      {errors.estatura_cm === 'Required'
                        ? 'El campo es requerido'
                        : errors.estatura_cm}
                    </Text>
                  )}
                </View>
              </View>
              <View className="gap-2">
                <View className="flex-row gap-1">
                  <Label>Observaciones Adicionales</Label>
                  <Text className="text-sm italic">(Opcional)</Text>
                </View>

                <View
                  className={cn('flex flex-col', {
                    'gap-1': errors.observaciones
                  })}
                >
                  <Input
                    value={currentStudent.observaciones}
                    onChangeText={(text) => {
                      validate({ field: 'observaciones', value: text })
                      setCurrentStudent((prev) => ({
                        ...prev,
                        observaciones: text
                      }))
                    }}
                    multiline
                    placeholder="Agrega algo que tendríamos que tener en cuenta de tu hijo"
                    style={{
                      height: 200,
                      textAlignVertical: 'top'
                    }}
                  />
                  {errors.observaciones && (
                    <Text className="text-xs font-bold leading-none text-red-500 mt-1">
                      {errors.observaciones === 'Required'
                        ? 'El campo es requerido'
                        : errors.observaciones}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <Button
              variant="secondary"
              onPress={() => {
                addStudent()
              }}
            >
              <Icon as={PlusIcon} size={18} />
              <Text>Agregar este hijo/a</Text>
            </Button>
          </View>
        </CardContent>
        <CardFooter>
          <GradientButton
            onPress={handleNext}
            disabled={isSubmitting}
            colors={BUTTON_COLORS_GRADIENT}
          >
            <Text className="text-white font-semibold">
              Continuar con el Registro
            </Text>
            <ArrowRight color="white" size={18} />
          </GradientButton>
        </CardFooter>
      </Card>
    </View>
  )
}
