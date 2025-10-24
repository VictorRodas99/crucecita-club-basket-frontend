import { Text, View } from 'react-native'

export default function Login() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text
        style={{ fontFamily: 'Inter-Black' }}
        className="text-xl font-bold text-red-500"
      >
        Login
      </Text>
    </View>
  )
}
