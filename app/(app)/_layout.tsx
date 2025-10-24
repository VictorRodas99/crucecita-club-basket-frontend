import { useSession } from '@/resources/hooks/session'
import { Redirect, Slot } from 'expo-router'

export default function AppLayout() {
  const { session } = useSession()

  if (!session?.accessToken) {
    // @ts-ignore
    return <Redirect href="/(auth)/login" />
  }

  return <Slot />
}
