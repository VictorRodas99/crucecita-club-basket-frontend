import DateTimePicker, {
  AndroidNativeProps,
  DateTimePickerEvent,
  IOSNativeProps,
  WindowsNativeProps
} from '@react-native-community/datetimepicker'
import { ClassValue } from 'clsx'
import { CalendarPlus } from 'lucide-react-native'
import { PropsWithChildren, useState } from 'react'
import {
  Pressable,
  TextInput,
  TextInputProps,
  useColorScheme,
  View
} from 'react-native'
import { cn, parseDate } from '../lib/utils'
import { DEFAULT_INPUT_STYLES, Input } from './primitives/input'
import { Text } from './primitives/text'

type DateTimePickerProps =
  | IOSNativeProps
  | AndroidNativeProps
  | WindowsNativeProps

export default function DatePicker({
  children,
  onChange,
  value,
  triggerClassName,
  ...props
}: PropsWithChildren<
  Omit<DateTimePickerProps, 'onChange'> & {
    onChange?: (date: Date) => void
    triggerClassName?: ClassValue
  }
>) {
  const [show, setShow] = useState(false)
  const dateValue = value ? new Date(value) : new Date()

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate && typeof onChange === 'function') {
      onChange(selectedDate)
    }

    setShow(false)
  }

  return (
    <>
      <Pressable
        onPress={() => setShow(true)}
        className={cn(DEFAULT_INPUT_STYLES, triggerClassName)}
      >
        {children ?? (
          <Text className="text-muted-foreground">
            {dateValue.toLocaleDateString()}
          </Text>
        )}
      </Pressable>

      {show && (
        <DateTimePicker
          value={dateValue}
          onChange={handleChange}
          mode="date"
          {...props}
          display="default"
        />
      )}
    </>
  )
}

type InputProps = TextInputProps & React.RefAttributes<TextInput>

export function InputDate({
  value: externalValue,
  onChangeText,
  includePicker = false,
  ...props
}: InputProps & { includePicker?: boolean }) {
  const [internalValue, setInternalValue] = useState('')
  const colorScheme = useColorScheme()

  const value = externalValue ?? internalValue
  const setValue = externalValue !== undefined ? onChangeText : setInternalValue

  const formatDate = (text: string): string => {
    const digits = text.replace(/\D/g, '').slice(0, 8)

    if (digits.length <= 2) return digits
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`

    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.substring(4)}`
  }

  const handleChange = (text: string) => {
    const formatted = formatDate(text)
    setValue?.(formatted)
  }

  const handlePickerChange = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const formatted = `${day}/${month}/${year}`
    setValue?.(formatted)
  }

  return (
    <View className="relative">
      {includePicker && (
        <View
          className="absolute right-0 top-0 bottom-0 justify-center"
          style={{ zIndex: 20 }}
        >
          <DatePicker
            value={parseDate(value) || new Date()}
            onChange={handlePickerChange}
            triggerClassName="shadow-none border-none"
          >
            <CalendarPlus
              size={18}
              color={colorScheme === 'dark' ? 'white' : 'black'}
            />
          </DatePicker>
        </View>
      )}
      <Input
        placeholder="DD/MM/YYYY"
        {...props}
        value={value}
        onChangeText={handleChange}
        keyboardType="numeric"
        maxLength={10}
        className={cn({ 'w-[83%]': includePicker })}
      />
    </View>
  )
}
