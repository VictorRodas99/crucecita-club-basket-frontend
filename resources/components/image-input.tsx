import * as ImagePickerLibrary from 'expo-image-picker'
import { Image as ImageIcon } from 'lucide-react-native'
import { Image, Pressable, View } from 'react-native'

function ImageFallback() {
  return (
    <View className="size-full justify-center items-center">
      <ImageIcon size={24} color="white" />
    </View>
  )
}

export interface PickedImageAsset {
  uri: string
  fileName?: string | null
  fileSize?: number
  mimeType?: string
  width?: number
  height?: number
}

interface ImagePickerProps {
  value?: PickedImageAsset | null
  onChange?: (image: ImagePickerProps['value']) => void
}

export default function ImagePicker({ value, onChange }: ImagePickerProps) {
  const pickImage = async () => {
    let result = await ImagePickerLibrary.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8
    })

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0]

      onChange?.({
        uri: asset.uri,
        fileName: asset.fileName,
        fileSize: asset.fileSize,
        mimeType: asset.mimeType,
        width: asset.width,
        height: asset.height
      })
    }
  }

  return (
    <View className="gap-2">
      <View className="relative size-20 rounded-full overflow-hidden bg-primary/70">
        <Pressable
          className="absolute inset-0 bg-transparent"
          onPress={pickImage}
          style={{ zIndex: 20 }}
        />
        {value?.uri ? (
          <Image
            className="size-full object-cover"
            source={{ uri: value.uri }}
          />
        ) : (
          <ImageFallback />
        )}
      </View>
    </View>
  )
}
