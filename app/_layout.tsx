import { ToastContainer } from '@/resources/components/toast'
import { SessionProvider } from '@/resources/context/session.context'
import { ToastProvider } from '@/resources/context/toast.context'
import '@/resources/css/global.css'
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts
} from '@expo-google-fonts/inter'
import { PortalHost } from '@rn-primitives/portal'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Slot, SplashScreen } from 'expo-router'
import { useEffect } from 'react'

SplashScreen.preventAutoHideAsync()
const queryClient = new QueryClient()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ToastProvider>
          <ToastContainer />
          <Slot />
          <PortalHost />
        </ToastProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}
