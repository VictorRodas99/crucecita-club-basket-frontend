/**
 * File object structure for React Native FormData uploads
 * This interface matches what React Native's FormData expects
 */
export interface RNFile {
  /** Local file URI
   * @example 'file:///path/to/file.jpg'
   */
  uri: string

  /** MIME type of the file
   * @example 'image/jpeg', 'application/pdf'
   */
  mimeType?: string

  /** File name with extension
   * @example 'photo.jpg', 'document.pdf' */
  name: string

  size?: number
}
