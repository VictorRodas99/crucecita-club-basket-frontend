import { Text } from '@/resources/components/primitives/text'
import { USER_ROLE } from '@/resources/constants/config'
import registerFormSchema from '@/resources/forms/auth/register.zod'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Device from 'expo-device'
import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import StepOne from './step-one'

/* <Button variant="link" onPress={() => router.push('/login')}>
          <Text>Login</Text>
        </Button> */

/**
  -> tipo de usuario (Rol)
  -> datos comunes (Nombre, Email, Telefono, Foto de Perfil, Fecha de Nacimiento)
  -> [if rol == 'tutor'] datos comunes de hijos (cargar hijos y al hacer click cargar los demas datos)
  -> cargar contrasenia (confirmar contrasenia) [con nota incluida al final]
 */

const STEP = Object.freeze({
  one: 'step-one',
  two: 'step-two',
  studentsStep: 'students-step-if-parent',
  three: 'step-three'
})

export interface StepsProps {
  onNext: () => void
  onPrevious?: () => void
}

const components = {
  [STEP.one]: (props: StepsProps) => <StepOne {...props} />,
  [STEP.two]: (props: StepsProps) => <Text>Hola</Text>,
  [STEP.studentsStep]: (props: StepsProps) => <Text>Hola</Text>,
  [STEP.three]: (props: StepsProps) => <Text>Hola</Text>
}

export type FlowStep = (typeof STEP)[keyof typeof STEP]
export type RegisterFormData = z.infer<typeof registerFormSchema>

/**
 * Registration Flow
 */
export default function Register() {
  const [step, setStep] = useState<{ previous: FlowStep; current: FlowStep }>({
    previous: STEP.one,
    current: STEP.one
  })

  const CurrentStepForm = useMemo(() => components[step.current], [step])

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      device_name: Device.deviceName ?? 'web'
    },
    mode: 'onChange'
  })

  const handleNextStep = () => {
    const { current: newPrev } = step
    const isParent = form.getValues('rol').value === USER_ROLE.tutor

    const steps = Object.values(STEP)

    const nextIndex = steps.findIndex((step) => step === newPrev) + 1
    const absoluteNextStep = steps[nextIndex]

    const relativeNextStep =
      absoluteNextStep === STEP.studentsStep && !isParent
        ? (steps[nextIndex + 1] ?? STEP.one)
        : absoluteNextStep

    setStep({ previous: newPrev, current: relativeNextStep })
  }

  const handlePrevStep = () => {
    const { previous: newCurrent } = step
    const steps = Object.values(STEP)

    const newPrevIndex = steps.findIndex((step) => step === newCurrent) - 1
    const newPrevious = steps[newPrevIndex] ?? STEP.one

    setStep({
      current: newCurrent,
      previous: newPrevious
    })
  }

  return (
    <FormProvider {...form}>
      <CurrentStepForm onNext={handleNextStep} onPrevious={handlePrevStep} />
    </FormProvider>
  )
}
