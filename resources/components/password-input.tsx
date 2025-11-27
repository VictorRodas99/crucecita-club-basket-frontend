import { Eye, EyeClosed, LucideProps } from 'lucide-react-native'
import { useState } from 'react'
import {
  Pressable,
  TextInput,
  TextInputProps,
  useColorScheme,
  View
} from 'react-native'
import { Input } from './primitives/input'

type InputProps = TextInputProps & React.RefAttributes<TextInput>

const EyeIcon = ({
  type,
  ...props
}: { type: 'opened' | 'closed' } & LucideProps) => {
  if (type === 'opened') {
    return <Eye {...props} />
  }

  if (type === 'closed') {
    return <EyeClosed {...props} />
  }

  throw new Error(
    `Invalid type, expected "opened" or "closed" but "${type}" was given`
  )
}

export default function PasswordInput({ ...props }: InputProps) {
  const [isPasswordInputSecured, setIsPasswordInputSecured] = useState(true)
  const colorScheme = useColorScheme()

  return (
    <View className="relative">
      <Input
        placeholder="*****"
        autoCapitalize="none"
        secureTextEntry={isPasswordInputSecured}
        {...props}
      />
      <View className="absolute top-2 right-3">
        <Pressable onPress={() => setIsPasswordInputSecured((prev) => !prev)}>
          <EyeIcon
            type={isPasswordInputSecured ? 'opened' : 'closed'}
            color={colorScheme === 'dark' ? 'white' : 'black'}
          />
        </Pressable>
      </View>
    </View>
  )
}
