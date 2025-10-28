import { USER_ROLE } from '@/resources/constants/config'
import { Role } from '@/resources/types/user'
import { z } from 'zod'

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
      .string()
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
    fecha_nacimiento: z
      .string()
      .min(1, 'La fecha de nacimiento es requerida')
      .refine((date) => {
        const parsedDate = new Date(date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return parsedDate < today
      }, 'La fecha de nacimiento debe ser anterior a hoy'),
    descripcion: z
      .string()
      .max(500, 'La descripción no puede superar los 500 caracteres')
      .optional()
      .or(z.literal('')),
    telefono: z
      .string()
      .min(8, 'El teléfono debe tener al menos 8 caracteres')
      .max(20, 'El teléfono no puede superar los 20 caracteres'),
    foto_perfil: z
      .instanceof(File)
      .refine((file) => file.size > 0, 'La foto de perfil es requerida')
      .refine(
        (file) => file.size <= 4 * 1024 * 1024, // 4096 KB = 4MB
        'La foto de perfil no debe superar los 4MB'
      )
      .refine((file) => {
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']
        return allowedTypes.includes(file.type)
      }, 'La foto de perfil debe ser PNG o JPG')
      .optional(),
    alumnos: z
      .array(
        z.object({
          nombre: z
            .string()
            .min(2, 'El nombre del alumno debe tener al menos 2 caracteres')
            .max(
              255,
              'El nombre del alumno no puede superar los 255 caracteres'
            ),
          apellido: z
            .string()
            .min(2, 'El apellido del alumno debe tener al menos 2 caracteres')
            .max(
              255,
              'El apellido del alumno no puede superar los 255 caracteres'
            ),
          fecha_nacimiento: z
            .string()
            .min(1, 'La fecha de nacimiento es requerida')
            .refine((date) => {
              const parsedDate = new Date(date)
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              return parsedDate < today
            }, 'La fecha de nacimiento debe ser anterior a hoy'),
          ficha_medica: z
            .instanceof(File)
            .refine(
              (file) => file.size > 0,
              'La ficha médica no puede estar vacía'
            )
            .refine(
              (file) => file.size <= 2 * 1024 * 1024, // 2048 KB = 2MB
              'La ficha médica no debe superar los 2MB'
            )
            .refine(
              (file) => file.type === 'application/pdf',
              'La ficha médica debe ser un archivo PDF'
            ),
          foto_cedula_frontal: z
            .instanceof(File)
            .refine(
              (file) => file.size > 0,
              'La foto de cédula frontal no puede estar vacía'
            )
            .refine(
              (file) => file.size <= 4 * 1024 * 1024, // 4096 KB = 4MB
              'La foto frontal no debe superar los 4MB'
            )
            .refine((file) => {
              const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']
              return allowedTypes.includes(file.type)
            }, 'La foto frontal de la cédula debe ser PNG o JPG'),
          foto_cedula_dorsal: z
            .instanceof(File)
            .refine(
              (file) => file.size > 0,
              'La foto de cédula dorsal no puede estar vacía'
            )
            .refine(
              (file) => file.size <= 4 * 1024 * 1024, // 4096 KB = 4MB
              'La foto dorsal no debe superar los 4MB'
            )
            .refine((file) => {
              const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']
              return allowedTypes.includes(file.type)
            }, 'La foto dorsal de la cédula debe ser PNG o JPG'),
          peso_kg: z.coerce
            .number({ invalid_type_error: 'El peso debe ser un número' })
            .min(0.01, 'El peso debe ser mayor a 0')
            .max(199.99, 'El peso no puede superar los 199.99 kg'),
          estatura_cm: z.coerce
            .number({ invalid_type_error: 'La estatura debe ser un número' })
            .min(0.01, 'La estatura debe ser mayor a 0')
            .max(299.99, 'La estatura no puede superar los 299.99 cm'),
          observaciones: z
            .string()
            .max(
              1000,
              'Las observaciones no pueden superar los 1000 caracteres'
            )
            .optional()
            .or(z.literal(''))
        })
      )
      .optional()
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
    // Si el rol es tutor, debe tener al menos un alumno
    if (rol.value === USER_ROLE.tutor && (!alumnos || alumnos.length === 0)) {
      context.addIssue({
        code: 'custom',
        message: 'Los tutores deben registrar al menos un alumno',
        path: ['alumnos']
      })
    }
  })

export default registerFormSchema
