import { useSession } from '@/resources/hooks/session'
import { Redirect, Slot } from 'expo-router'

export default function AuthLayout() {
  const { session } = useSession()

  if (session?.accessToken) {
    return <Redirect href="/" />
  }

  return <Slot />
}
