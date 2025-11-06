import * as ImagePickerLibrary from 'expo-image-picker'
import { Image as ImageIcon } from 'lucide-react-native'
import { Image, Pressable, View } from 'react-native'
import { PickedImageAsset } from '../forms/image.zod'
import { cn } from '../lib/utils'
import { Icon } from './icon'

function DefaultImageFallack({
  className,
  color,
  size = 24
}: {
  className?: string
  size?: number
  color?: string
}) {
  return (
    <View className={cn('size-full justify-center items-center', className)}>
      <Icon as={ImageIcon} size={size} color={color} />
    </View>
  )
}

interface ImagePickerProps {
  value?: PickedImageAsset | null
  onChange?: (image: ImagePickerProps['value']) => void
  className?: string
  iconSize?: number
  iconColor?: string
  render?: (image: PickedImageAsset | null) => React.JSX.Element
  allowsEditing?: boolean
}

export default function ImagePicker({
  value,
  onChange,
  className,
  allowsEditing = true,
  ...props
}: ImagePickerProps) {
  const pickImage = async () => {
    let result = await ImagePickerLibrary.launchImageLibraryAsync({
      allowsEditing,
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
      <View className={cn('relative overflow-hidden bg-primary/70', className)}>
        <Pressable
          className="absolute inset-0 bg-transparent"
          onPress={pickImage}
          style={{ zIndex: 20 }}
        />
        <ResultingImage image={value ?? null} {...props} />
      </View>
    </View>
  )
}

function ResultingImage({
  image,
  render,
  iconSize,
  iconColor
}: {
  image: PickedImageAsset | null
  render?: ImagePickerProps['render']
  iconColor?: ImagePickerProps['iconColor']
  iconSize?: ImagePickerProps['iconSize']
}) {
  if (typeof render === 'function') {
    return render(image)
  }

  if (image?.uri) {
    return (
      <Image className="size-full object-cover" source={{ uri: image.uri }} />
    )
  }

  return <DefaultImageFallack size={iconSize} color={iconColor} />
}
