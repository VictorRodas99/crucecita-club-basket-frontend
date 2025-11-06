import { USER_ROLE } from '@/resources/constants/config'
import { getYearsSince, parseDate } from '@/resources/lib/utils'
import { Role } from '@/resources/types/user'
import { z } from 'zod'
import { commonDateSchema } from '../date.zod'
import { fileSchema } from '../file.zod'
import { imageSchema } from '../image.zod'

const commonImageRules = imageSchema
  .refine((file) => file.uri.length > 0, 'La foto de perfil es requerida')

  .refine(
    (file) => !file.fileSize || file.fileSize <= 4 * 1024 * 1024,
    'La foto de perfil no debe superar los 4MB'
  )
  .refine((file) => {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']
    return !file.mimeType || allowedTypes.includes(file.mimeType)
  }, 'La foto de perfil debe ser PNG o JPG')

export const studentsSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre del alumno debe tener al menos 2 caracteres')
    .max(255, 'El nombre del alumno no puede superar los 255 caracteres'),
  apellido: z
    .string()
    .min(2, 'El apellido del alumno debe tener al menos 2 caracteres')
    .max(255, 'El apellido del alumno no puede superar los 255 caracteres'),
  fecha_nacimiento: commonDateSchema.refine((date) => {
    const parsedDate = parseDate(date)

    if (!parsedDate) {
      return false
    }

    const years = getYearsSince(parsedDate)

    return years < 18
  }, 'Fecha inválida para registrar'),
  ficha_medica: fileSchema
    .refine(
      (file) => !file?.size || file.size > 0,
      'La ficha médica no puede estar vacía'
    )
    .refine(
      (file) => file?.size && file.size <= 2 * 1024 * 1024, // 2048 KB = 2MB
      'La ficha médica no debe superar los 2MB'
    )
    .refine(
      (file) => file.mimeType === 'application/pdf',
      'La ficha médica debe ser un archivo PDF'
    ),
  foto_cedula_frontal: commonImageRules,
  foto_cedula_dorsal: commonImageRules,
  peso_kg: z
    .string({ message: 'Se necesita un dato numérico' })
    .min(1, 'El peso es requerido')
    .refine(
      (val) => /^\d+,\d{1,2}$/.test(val) || /^\d+$/.test(val),
      'El peso debe usar tener un formato válido'
    )
    .transform((val) => parseFloat(val.replace(',', '.')))
    .refine((num) => num >= 0.01, 'El peso debe ser mayor a 0')
    .refine((num) => num <= 199.99, 'El peso no puede superar los 199.99 kg')
    .transform((value) => String(value)),
  estatura_cm: z
    .string({ message: 'Se necesita un dato numérico' })
    .min(1, 'La estatura es requerida')
    .refine(
      (val) => /^\d+,\d{1,2}$/.test(val) || /^\d+$/.test(val),
      'La estatura debe usar tener un formato válido'
    )
    .transform((val) => parseFloat(val.replace(',', '.')))
    .refine((num) => num >= 0.01, 'La estatura debe ser mayor a 0')
    .refine(
      (num) => num <= 299.99,
      'La estatura no puede superar los 299.99 cm'
    )
    .transform((value) => String(value)),
  observaciones: z
    .string()
    .max(1000, 'Las observaciones no pueden superar los 1000 caracteres')
    .optional()
    .or(z.literal(''))
})

const registerFormSchema = z
  .object({
    device_name: z.string().min(1, 'El nombre del dispositivo es requerido'),
    rol: z.object(
      {
        label: z.string(),
        value: z.enum(Object.values(USER_ROLE) as [Role, ...Role[]], {
          errorMap: () => ({ message: 'Debe seleccionar un rol válido' })
        })
      },
      { message: 'El rol es requerido' }
    ),
    nombre: z
      .string({ message: 'El nombre es requerido' })
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(255, 'El nombre no puede superar los 255 caracteres'),
    apellido: z
      .string()
      .min(2, 'El apellido debe tener al menos 2 caracteres')
      .max(255, 'El apellido no puede superar los 255 caracteres'),
    email: z
      .string()
      .email('Email inválido')
      .max(255, 'El email no puede superar los 255 caracteres'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    password_confirmation: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    fecha_nacimiento: commonDateSchema.refine((date) => {
      const parsedDate = parseDate(date)

      if (!parsedDate) {
        return false
      }

      const years = getYearsSince(parsedDate)

      return years >= 18
    }, 'Debes ser mayor a 18 años para registrarte'),
    descripcion: z
      .string()
      .max(500, 'La descripción no puede superar los 500 caracteres')
      .optional()
      .or(z.literal('')),
    telefono: z
      .string()
      .min(10, 'El teléfono debe tener al menos 10 caracteres')
      .max(20, 'El teléfono no puede superar los 20 caracteres')
      .regex(
        /^[0-9+\-\s()]*$/,
        'El teléfono solo puede contener números, +, -, espacios y paréntesis'
      )
      .refine(
        (value) => {
          // Eliminar caracteres no numéricos para validar
          const phoneNumber = value.replace(/[^0-9]/g, '')
          return phoneNumber.length >= 8 && phoneNumber.length <= 10
        },
        {
          message:
            'El teléfono debe contener al menos 8 dígitos y no superar los 10 dígitos'
        }
      )
      .refine(
        (value) => {
          const phoneNumber = value.replaceAll(' ', '')
          // Validar formatos comunes de Paraguay
          // Móviles: 09XX XXX XXX (10 dígitos)
          // Fijos: 021 XXX XXX (9 dígitos para Asunción)
          // Con código país: +595 9XX XXX XXX
          // return numeros.length >= 8 && numeros.length <= 15
          return (
            phoneNumber.startsWith('09') ||
            phoneNumber.startsWith('021') ||
            phoneNumber.startsWith('+595')
          )
        },
        { message: 'El número de teléfono no tiene un formato válido' }
      )
      .refine(
        (phoneNumber) => {
          // Si tiene código de país +595, validar formato paraguayo
          if (phoneNumber.startsWith('+595')) {
            return phoneNumber.replaceAll(' ', '').length === 13
          }

          return true
        },
        { message: 'Formato con código de país incompleto (+595 XXX XXX XXX)' }
      ),
    foto_perfil: commonImageRules.optional(),
    alumnos: z.array(studentsSchema).optional()
  })
  .superRefine(({ password, password_confirmation }, context) => {
    if (password !== password_confirmation) {
      context.addIssue({
        code: 'custom',
        message: 'Las contraseñas no coinciden',
        path: ['password_confirmation']
      })
    }
  })
  .superRefine(({ rol, alumnos }, context) => {
    // Si el rol es tutor, debe tener al menos un alumnog
    if (rol.value === USER_ROLE.tutor && (!alumnos || alumnos.length === 0)) {
      context.addIssue({
        code: 'custom',
        message: 'Los tutores deben registrar al menos un alumno',
        path: ['alumnos']
      })
    }
  })

export default registerFormSchema
