import {
  Controller,
  ControllerProps,
  FieldValues,
  Path,
  UseFormReturn
} from 'react-hook-form'
import { TextInput, TextInputProps, View } from 'react-native'
import { cn } from '../lib/utils'
import { Input } from './primitives/input'
import { Text } from './primitives/text'

type InputProps = TextInputProps & React.RefAttributes<TextInput>

interface FormFieldProps<T extends FieldValues> extends InputProps {
  name: Path<T>
  form: UseFormReturn<T>
  render?: ControllerProps<T>['render']
}

export default function FormField<T extends FieldValues>({
  form,
  name,
  render,
  ...props
}: FormFieldProps<T>) {
  return (
    <Controller<T>
      name={name}
      control={form.control}
      render={
        render
          ? render
          : ({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <View className={cn('flex flex-col', { 'gap-1': error })}>
                <Input
                  {...props}
                  onBlur={(event) =>
                    props.onBlur ? props.onBlur(event) : onBlur()
                  }
                  onChangeText={onChange}
                  value={value}
                />

                {error && (
                  <Text className="text-xs font-bold leading-none text-red-500 mt-1">
                    {error.message ?? 'El campo es requerido'}
                  </Text>
                )}
              </View>
            )
      }
    />
  )
}
