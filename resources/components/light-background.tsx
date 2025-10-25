import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'

export default function LightBackground() {
  return (
    <View className="absolute top-0 h-screen w-screen" style={{ zIndex: -2 }}>
      <LinearGradient
        colors={[
          'rgba(0,163,255,0.13)',
          'rgba(0,163,255,0)',
          'rgba(0,163,255,0)'
        ]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
        className="h-full w-full bg-transparent"
      />
    </View>
  )
}
