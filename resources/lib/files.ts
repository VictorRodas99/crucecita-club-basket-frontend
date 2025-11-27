import { RNFile } from '../types/file'

export function createReactNativeFile({
  name,
  mimeType,
  uri,
  size
}: {
  name?: string | null
  mimeType: string
  uri: string
  size?: number
}): RNFile {
  const fileName =
    name || `file_${Date.now()}.${getExtensionFromMime(mimeType)}`

  const file: RNFile = {
    uri,
    name: fileName,
    mimeType
  }

  if (size) {
    file['size'] = size
  }

  return file
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMime(mimeType: string): string {
  const mimeMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'docx',
    'text/plain': 'txt',
    'application/zip': 'zip'
  }

  return mimeMap[mimeType] || 'bin'
}
