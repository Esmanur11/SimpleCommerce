export interface ProductListItem {
  id: string
  name: string
  description: string
  price: number
  categoryId: string | null
  categoryName: string | null
  stockQuantity: number
  imageUrl: string | null
}

export interface ProductVariant {
  variantId: string
  size: string
  color: string
  stockQuantity: number
}

export interface ProductDetail {
  id: string
  name: string
  description: string
  price: number
  categoryId: string | null
  categoryName: string | null
  variants: ProductVariant[]
  imageUrl: string | null
}

export interface CreateProductRequest {
  name: string
  description: string
  categoryId: string
  initialPrice: number
}

export interface CreateVariantRequest {
  size: string
  color: string
  stockQuantity: number
}

export interface UpdateStockRequest {
  newStockQuantity: number
}

export interface UpdatePriceRequest {
  newAmount: number
}
