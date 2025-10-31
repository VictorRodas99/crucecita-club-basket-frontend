import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient'
import { Pressable, PressableProps } from 'react-native'
import { cn } from '../lib/utils'

interface GradientButtonProps extends PressableProps {
  colors: LinearGradientProps['colors']
}

export default function GradientButton({
  children,
  colors,
  ...props
}: GradientButtonProps) {
  if (typeof children === 'function') {
    throw new Error('Children must be a React Node')
  }

  return (
    <Pressable className={cn('w-full opacity-100', props.className)} {...props}>
      <LinearGradient
        className="flex flex-row gap-2"
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: '100%',
          paddingVertical: 8,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {children}
      </LinearGradient>
    </Pressable>
  )
}
