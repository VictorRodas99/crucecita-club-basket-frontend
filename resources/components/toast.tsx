import { CircleCheck, CircleX } from 'lucide-react-native'
import { useCallback, useEffect, useRef } from 'react'
import { Animated, Text, View } from 'react-native'
import { useToast } from '../hooks/toast'
import { cn } from '../lib/utils'
import { Icon } from './icon'

export interface ToastProps {
  type: ToastType
  message: string
  duration?: number
}

export type ToastType = 'success' | 'error'

const Toast = ({ type = 'success', message, duration = 350 }: ToastProps) => {
  const bottom = useRef(new Animated.Value(-120)).current

  const { hideToast } = useToast()

  const variants = {
    success: {
      title: 'Success',
      icon: CircleCheck,
      style: 'green',
      bgColor: 'bg-green-100'
    },
    error: {
      title: 'Error',
      icon: CircleX,
      style: 'red',
      bgColor: 'bg-red-100'
    }
  }

  const animate = useCallback(() => {
    Animated.timing(bottom, {
      toValue: 20,
      duration,
      useNativeDriver: false
    }).start(() => {
      Animated.timing(bottom, {
        toValue: -120,
        duration,
        delay: 1500,
        useNativeDriver: false
      }).start(() => {
        hideToast()
      })
    })
  }, [bottom, duration, hideToast])

  useEffect(() => {
    animate()
  }, [type, animate])

  const selectedVariant = variants[type as keyof typeof variants]

  return (
    <Animated.View
      className={cn(
        'flex-row px-4 py-2.5 absolute left-4 right-4 rounded-lg z-50',
        selectedVariant.bgColor
      )}
      style={{ bottom }}
    >
      <Icon size={32} as={selectedVariant.icon} color={selectedVariant.style} />
      <View className="ml-3">
        <Text className="font-bold">{selectedVariant.title}</Text>
        <Text className="text-[15px]">{message}</Text>
      </View>
    </Animated.View>
  )
}

function ToastContainer() {
  const { toast } = useToast()

  if (!toast) {
    return null
  }

  return <Toast {...toast} />
}

export { Toast, ToastContainer }
