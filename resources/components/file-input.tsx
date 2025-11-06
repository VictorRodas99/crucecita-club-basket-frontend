import {
  getDocumentAsync,
  type DocumentPickerAsset
} from 'expo-document-picker'
import { Pressable, TextInput, TextInputProps, View } from 'react-native'
import { cn } from '../lib/utils'
import { Text } from './primitives/text'

type InputProps = TextInputProps & React.RefAttributes<TextInput>
type FileInputProps = Omit<Omit<InputProps, 'onChange'>, 'value'> & {
  value?: DocumentPickerAsset
  onChange?: (document: DocumentPickerAsset | null) => void
  render?: (document: DocumentPickerAsset | null) => React.JSX.Element
  errorMessage?: string
}

export default function FileInput({
  value,
  className,
  onChange,
  placeholder,
  render,
  errorMessage
}: FileInputProps) {
  const pickFile = async () => {
    const result = await getDocumentAsync({
      type: 'application/pdf'
    })

    const { assets, canceled } = result

    if (canceled || !assets || assets.length === 0) {
      return
    }

    if (typeof onChange !== 'function') {
      return
    }

    onChange(assets[0])
  }

  return (
    <View className="gap-2">
      <View className={cn('relative overflow-hidden', className)}>
        <Pressable
          className="absolute inset-0 bg-transparent"
          onPress={pickFile}
          style={{ zIndex: 20 }}
        />
        {render ? (
          render(value ?? null)
        ) : (
          <Text>
            {value?.uri ? value.name : (placeholder ?? 'Selecciona un archivo')}
          </Text>
        )}
      </View>
      {errorMessage && (
        <Text className="text-xs font-bold leading-none text-red-500 mt-1">
          {errorMessage ?? 'El campo es requerido'}
        </Text>
      )}
    </View>
  )
}
