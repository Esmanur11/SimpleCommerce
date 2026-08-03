import { z } from "zod"

export const createCategorySchema = z.object({
  name: z.string().min(1, "Kategori adı gerekli"),
  parentCategoryId: z.string().optional(),
})

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>
