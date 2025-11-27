import { z } from 'zod'

// export const fileSchema = z.object({
//   name: z.string(),
//   size: z.number().optional(),
//   uri: z.string(),
//   mimeType: z.string().optional(),
//   lastModified: z.number(),
//   file: z.instanceof(File).optional(),
//   base64: z.string().optional()
// })

export const fileSchema = z.object({
  uri: z.string(),
  mimeType: z.string().optional(),
  name: z.string(),
  size: z.number().optional()
})
