import {
  Select as PrimitiveSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/resources/components/primitives/select'
import type { TriggerRef } from '@rn-primitives/select'
import { RootProps as PrimitiveSelectProps } from '@rn-primitives/select'
import * as React from 'react'
import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { cn } from '../lib/utils'

interface SelectProps extends PrimitiveSelectProps {
  label: string
  options: { label: string; value: string }[]
  placeholder: string
}

export function Select({
  className,
  label,
  options,
  placeholder,
  ...props
}: SelectProps) {
  const ref = React.useRef<TriggerRef>(null)

  const insets = useSafeAreaInsets()

  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({
      ios: insets.bottom,
      android: insets.bottom + 24
    }),
    left: 12,
    right: 12
  }

  // Workaround for rn-primitives/select not opening on mobile
  // function onTouchStart() {
  //   ref.current?.open()
  // }

  return (
    <PrimitiveSelect {...props}>
      <SelectTrigger ref={ref} className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        insets={contentInsets}
        className={cn(className, 'w-[77%]')}
      >
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              label={option.label}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </PrimitiveSelect>
  )
}
