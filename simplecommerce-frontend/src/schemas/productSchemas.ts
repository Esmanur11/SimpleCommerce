import { z } from "zod"

export const createProductSchema = z.object({
  name: z.string().min(1, "Ürün adı gerekli"),
  description: z.string().min(1, "Açıklama gerekli"),
  categoryId: z.string().min(1, "Kategori seçin"),
  initialPrice: z.coerce.number().positive("Fiyat 0'dan büyük olmalı"),
})

export type CreateProductFormInput = z.input<typeof createProductSchema>
export type CreateProductFormValues = z.output<typeof createProductSchema>

export const createVariantSchema = z.object({
  size: z.string().min(1, "Beden gerekli"),
  color: z.string().min(1, "Renk gerekli"),
  stockQuantity: z.coerce.number().int().min(0, "Stok 0 veya üzeri olmalı"),
})

export type CreateVariantFormInput = z.input<typeof createVariantSchema>
export type CreateVariantFormValues = z.output<typeof createVariantSchema>
