import LightBackground from '@/resources/components/light-background'
import { useSession } from '@/resources/hooks/session'
import { Redirect, Slot } from 'expo-router'
import { Image, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const mainLogo = require('@/resources/assets/images/main-logo.png')

export default function AuthLayout() {
  const { session } = useSession()

  if (session?.accessToken) {
    return <Redirect href="/" />
  }

  return (
    <View className="flex-1 bg-primary/20 dark:bg-secondary">
      <SafeAreaView className="flex-1">
        <LightBackground />
        <View className="flex-1 px-5">
          <View className="items-center py-12 gap-2">
            <View className="size-12">
              <Image source={mainLogo} className="flex-1 size-full" />
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-black dark:text-white">
                Club Crucecita de Basket
              </Text>
              <Text className="text-muted-foreground">
                Gestión Integral de Básquetbol
              </Text>
            </View>
          </View>
          <Slot />
        </View>
      </SafeAreaView>
    </View>
  )
}
