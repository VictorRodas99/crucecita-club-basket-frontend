import { z } from 'zod'

export const imageSchema = z.object({
  uri: z.string(),
  fileName: z.string().optional().nullable(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional()
})

export type PickedImageAsset = z.infer<typeof imageSchema>
