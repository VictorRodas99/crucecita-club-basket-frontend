import LightBackground from '@/resources/components/light-background'
import { useSession } from '@/resources/hooks/session'
import { Redirect, Slot } from 'expo-router'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function AuthLayout() {
  const { session } = useSession()

  if (session?.accessToken) {
    return <Redirect href="/" />
  }

  return (
    <View className="flex-1 bg-primary/80 dark:bg-secondary">
      <SafeAreaView className="flex-1">
        <LightBackground />
        <Slot />
      </SafeAreaView>
    </View>
  )
}
