import { DocumentPickerOptions, getDocumentAsync } from 'expo-document-picker'
import { Pressable, TextInput, TextInputProps, View } from 'react-native'
import { createReactNativeFile } from '../lib/files'
import { cn } from '../lib/utils'
import { RNFile } from '../types/file'
import { Text } from './primitives/text'

type InputProps = TextInputProps & React.RefAttributes<TextInput>
type FileInputProps = Omit<Omit<InputProps, 'onChange'>, 'value'> & {
  value?: RNFile
  onChange?: (document: RNFile | null) => void
  render?: (document: RNFile | null) => React.JSX.Element
  errorMessage?: string
} & DocumentPickerOptions

export default function FileInput({
  value,
  className,
  onChange,
  placeholder,
  render,
  errorMessage,
  ...pickerOptions
}: FileInputProps) {
  const pickFile = async () => {
    const result = await getDocumentAsync({
      type: 'application/pdf',
      ...pickerOptions
    })

    const { assets, canceled } = result

    if (canceled || !assets || assets.length === 0) {
      return
    }

    if (typeof onChange !== 'function') {
      return
    }

    const asset = assets[0]

    onChange(
      createReactNativeFile({
        mimeType: asset.mimeType ?? 'text/plain',
        uri: asset.uri,
        name: asset.name,
        size: asset.size
      })
    )
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
