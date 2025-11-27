import { isPlainObject } from './utils'

//stackoverflow.com/questions/16104078/appending-array-to-formdata-and-send-via-ajax
export async function toFormData<T extends Record<string, any>>(data: T) {
  if (!isPlainObject(data)) {
    throw new Error(
      `Expected a plain Object {} but got ${Object.getPrototypeOf(data)} instead...`
    )
  }

  const updateFormData = async (
    formData: FormData,
    key: string,
    value: any
  ) => {
    if (Array.isArray(value)) {
      await Promise.all(
        value.map((item, index) =>
          updateFormData(formData, `${key}[${index}]`, item)
        )
      )

      return
    }

    if (isPlainObject(value)) {
      if ('uri' in value && 'mimeType' in value) {
        // const response = await fetch(value.uri as string)
        // const blob = await response.blob()
        // const file = new File(
        //   [blob],
        //   value?.name ?? value?.fileName ?? `file.${value.mimeType}`,
        //   { type: blob.type }
        // )

        const fileObject = {
          uri: value.uri,
          type: value.mimeType,
          name: value.name
        }

        // @ts-ignore React Native espera este schema
        formData.append(key, fileObject)

        return
      }

      await Promise.all(
        Object.entries(value).map(([subKey, subValue]) =>
          updateFormData(formData, `${key}[${subKey}]`, subValue)
        )
      )

      return
    }

    formData.append(key, value)
  }

  const formData = new FormData()

  await Promise.all(
    Object.entries(data).map(([key, value]) =>
      updateFormData(formData, key, value)
    )
  )

  return formData
}
